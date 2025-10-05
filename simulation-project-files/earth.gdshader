shader_type spatial;

uniform sampler2D texture_earth : source_color;

// Data from GDScript
const int MAX_IMPACTS = 50;
uniform int impact_count = 0;
uniform vec3 impact_centers[MAX_IMPACTS];
uniform float crater_radii_km[MAX_IMPACTS];
uniform float fireball_radii_km[MAX_IMPACTS];
uniform float blast_radii_km[MAX_IMPACTS];

// Colors from the Inspector
uniform vec3 crater_color : source_color = vec3(1.0, 0.0, 0.0);
uniform vec3 fireball_color : source_color = vec3(1.0, 0.5, 0.0);
uniform vec3 blast_color : source_color = vec3(0.0, 0.7, 1.0);

// --- NEW CONTROLS FOR THE RING EFFECT ---
uniform float border_width_km : hint_range(1.0, 500.0) = 50.0;
uniform float fill_alpha : hint_range(0.0, 1.0) = 0.1;
uniform float border_alpha : hint_range(0.0, 1.0) = 0.75;
uniform float emission_strength : hint_range(0.0, 10.0) = 1.5;

const float EARTH_RADIUS_KM = 6371.0;

varying vec3 pixel_world_pos;

void vertex() {
	pixel_world_pos = (MODEL_MATRIX * vec4(VERTEX, 1.0)).xyz;
}

void fragment() {
	vec3 earth_color = texture(texture_earth, UV).rgb;

	vec3 final_albedo = earth_color;
	vec3 final_emission = vec3(0.0);

	// Loop through all impacts to accumulate their effects.
	for (int i = 0; i < impact_count; i++) {
		float angle = acos(dot(normalize(pixel_world_pos), normalize(impact_centers[i])));
		float distance_km = angle * EARTH_RADIUS_KM;

		vec3 current_ring_color = vec3(0.0);
		float current_ring_outer_radius = 0.0;
		float current_ring_inner_radius = 0.0;

		// Determine which ring this pixel is in (if any).
		if (distance_km < crater_radii_km[i]) {
			current_ring_color = crater_color;
			current_ring_outer_radius = crater_radii_km[i];
			current_ring_inner_radius = 0.0; // The crater is the innermost circle.
		} else if (distance_km < fireball_radii_km[i]) {
			current_ring_color = fireball_color;
			current_ring_outer_radius = fireball_radii_km[i];
			current_ring_inner_radius = crater_radii_km[i];
		} else if (distance_km < blast_radii_km[i]) {
			current_ring_color = blast_color;
			current_ring_outer_radius = blast_radii_km[i];
			current_ring_inner_radius = fireball_radii_km[i];
		}

		// If this pixel is part of a ring for the current impact...
		if (current_ring_outer_radius > 0.0) {
			// Calculate the distance to the inner and outer borders of this ring.
			float dist_to_outer_border = abs(distance_km - current_ring_outer_radius);
			float dist_to_inner_border = abs(distance_km - current_ring_inner_radius);

			// Find the closest of the two borders.
			float dist_to_closest_border = min(dist_to_outer_border, dist_to_inner_border);

			// Use smoothstep to create a "glow" effect. It will be 1.0 at the border
			// and fade to 0.0 as we move away from it, over a distance of 'border_width_km'.
			float border_factor = 1.0 - smoothstep(0.0, border_width_km, dist_to_closest_border);

			// The final transparency is a mix between the fill and the border alpha,
			// based on how close we are to an edge.
			float blend_alpha = mix(fill_alpha, border_alpha, border_factor);

			// Blend the Albedo (base color).
			final_albedo = mix(final_albedo, current_ring_color, blend_alpha);

			// Add to the Emission. Only the borders will glow (where border_factor > 0).
			final_emission += current_ring_color * border_factor;
		}
	}

	// Apply the final calculated properties.
	ALBEDO = final_albedo;
	EMISSION = final_emission * emission_strength;
}