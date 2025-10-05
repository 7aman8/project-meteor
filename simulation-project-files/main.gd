# DISCLAIMER:
# The code was refined using AI. Not everything is AI-generated; however,
# various code snippets were taken from AI during research on how to tackle
# a specific task. AI was also used for help in mathematical calculations.

extends Node3D

@onready var location_picker: ImpactLocationPicker = $ImpactLocationPicker
@onready var launch_button: Button = $HUD/Control/HBoxContainer/MarginContainer/VBoxContainer/LaunchButton
@onready var earth: MeshInstance3D = $Earth/Mesh
@onready var neo_api_request: HTTPRequest = $NeoApiRequest
@onready var buttons_container: GridContainer = $HUD/Control/HBoxContainer/MarginContainer/VBoxContainer/ScrollContainer/VBoxContainer/ButtonsContainer
@onready var asteroid_selector_label: Label = $HUD/Control/HBoxContainer/MarginContainer/VBoxContainer/ScrollContainer/VBoxContainer/AsteroidSelectorLabel
@onready var impact_details: Label = $HUD/Control/VBoxContainer/ImpactDetailsContainer/PanelContainer/MarginContainer/VBoxContainer/ImpactDetails
@onready var impact_details_container: HBoxContainer = $HUD/Control/VBoxContainer/ImpactDetailsContainer

const ASTEROID_BUTTON = preload("res://asteroid_button.tscn")

var impact_location: Vector3

var live_asteroid_database: Array[Dictionary] = []
var next_page_url: String = ""
var selected_asteroid_data: Dictionary = {}

var impact_centers: Array[Vector3] = []
var crater_radii_km: Array[float] = []
var fireball_radii_km: Array[float] = []
var blast_radii_km: Array[float] = []

const MAX_IMPACTS = 50

var angle: float = 45


func _ready():
	impact_details_container.hide()
	location_picker.impact_location_selected.connect(_on_impact_location_selected)
	location_picker.enable_picking_mode()
	fetch_asteroid_data()

func fetch_asteroid_data():
	var api_key: String = "PzxhFEaKk07n3L4XS0hvqZCMzHvTGXN2X7l8Ey6X"
	var base_url = "https://api.nasa.gov/neo/rest/v1/neo/browse?"
	var full_url = base_url + "api_key=" + api_key
	
	print("Requesting data from: ", full_url)
	neo_api_request.request(full_url)

func _on_impact_location_selected(world_pos: Vector3, _normal: Vector3):
	print("Impact location selected: ", world_pos)
	launch_button.disabled = false
	impact_location = world_pos

func calculate_impact(diameter_m: float, density_kg_m3: float, velocity_ms: float, impact_angle_deg: float, _target_density_kg_m3: float) -> Dictionary:
	var radius_m = diameter_m / 2.0
	var volume_m3 = (4.0 / 3.0) * PI * pow(radius_m, 3)
	var mass_kg = volume_m3 * density_kg_m3
	var KE = 0.5 * mass_kg * pow(velocity_ms, 2)

	var impact_angle_rad = deg_to_rad(impact_angle_deg)
	var effective_energy_joules = KE * sin(impact_angle_rad)
	var energy_megatons = effective_energy_joules / 4.184e15

	var final_crater_diameter_km = 3.2 * pow(energy_megatons, 0.217)
	var crater_radius_km = final_crater_diameter_km / 2.0
	var fireball_radius_km = crater_radius_km * 2.5
	var blast_radius_km = crater_radius_km * 10.0

	return {
		"crater_radius_km": crater_radius_km,
		"fireball_radius_km": fireball_radius_km,
		"blast_radius_km": blast_radius_km
	}

func calculate_impact_velocity(approach_velocity_ms: float) -> float:
	var earth_escape_velocity = 11200.0  # m/s
	return sqrt(pow(approach_velocity_ms, 2) + pow(earth_escape_velocity, 2))

func _on_launch_button_pressed() -> void:
	if impact_location == Vector3.ZERO or selected_asteroid_data.is_empty():
		print("Please select an impact location and an asteroid.")
		return
		
	if impact_centers.size() >= MAX_IMPACTS:
		print("Max impacts reached!")
		return
	
	print("--- NEW IMPACT VISUALIZATION ---")
	
	var avg_diameter = (selected_asteroid_data["estimated_diameter"]["meters"]["estimated_diameter_min"] +
		selected_asteroid_data["estimated_diameter"]["meters"]["estimated_diameter_max"]) / 2.0
	var density = 2750
	
	var approach_velocity: float
	if not selected_asteroid_data["close_approach_data"].is_empty():
		approach_velocity = float(selected_asteroid_data["close_approach_data"][0]["relative_velocity"]["kilometers_per_second"]) * 1000.0
	else:
		print("WARNING: No close approach data found. Using default velocity (20 km/s).")
		approach_velocity = 20000.0
	
	var impact_velocity = calculate_impact_velocity(approach_velocity)
	var impact_results = calculate_impact(avg_diameter, density, impact_velocity, angle, 2700)
	
	impact_centers.append(impact_location)
	crater_radii_km.append(impact_results.crater_radius_km)
	fireball_radii_km.append(impact_results.fireball_radius_km)
	blast_radii_km.append(impact_results.blast_radius_km)
	update_shader_data()
	
	# --- Update the UI Display ---
	var crater_str = "%.1f" % impact_results.crater_radius_km
	var fireball_str = "%.1f" % impact_results.fireball_radius_km
	var blast_str = "%.1f" % impact_results.blast_radius_km
	var diameter_str = "%.1f" % (avg_diameter / 1000.0)
	var velocity_str = "%.1f" % (impact_velocity / 1000.0)
	var angle_str = "%.1f" % angle
	
	var text_lines = [
		"Simulating for: " + selected_asteroid_data["name"],
		"\n",
		"EFFECTS:",
		"- Crater Radius: " + crater_str + " km",
		"- Fireball Radius: " + fireball_str + " km",
		"- Blast Radius: " + blast_str + " km",
		"\n",
		"INPUTS:",
		"- Diameter: " + diameter_str + " km",
		"- Impact Velocity: " + velocity_str + " km/s",
		"- Impact Angle: " + angle_str + "°"
	]
	impact_details.text = "\n".join(text_lines)
	impact_details_container.show()
	
	# --- Reset for Next Shot ---
	impact_location = Vector3.ZERO
	launch_button.disabled = true
	location_picker.delete_impact_markers()
	location_picker.enable_picking_mode()

func update_shader_data():
	var earth_material = earth.get_surface_override_material(0)
	if not earth_material:
		return
	
	earth_material.set_shader_parameter("impact_count", impact_centers.size())
	earth_material.set_shader_parameter("impact_centers", impact_centers)
	earth_material.set_shader_parameter("crater_radii_km", crater_radii_km)
	earth_material.set_shader_parameter("fireball_radii_km", fireball_radii_km)
	earth_material.set_shader_parameter("blast_radii_km", blast_radii_km)

func add_asteroid_buttons(asteroids_to_add: Array):
	for a in asteroids_to_add:
		var b = ASTEROID_BUTTON.instantiate()
		b.name = a["name"]
		
		var avg_d_km = ((a["estimated_diameter"]["meters"]["estimated_diameter_min"] + 
						 a["estimated_diameter"]["meters"]["estimated_diameter_max"]) / 2.0) / 1000.0
		
		var velocity_text = "N/A"
		if not a["close_approach_data"].is_empty():
			var velocity_km_s = float(a["close_approach_data"][0]["relative_velocity"]["kilometers_per_second"])
			velocity_text = "%.1f km/s" % [velocity_km_s]
			
		var line1 = a["name"]
		var line2 = "Avg. Diameter: %.1f km" % [avg_d_km]
		var line3 = "Avg. Velocity: " + velocity_text
		
		b.text = "%s\n%s\n%s" % [line1, line2, line3]
		
		b.pressed.connect(_on_asteroid_button_selected.bind(a))
		buttons_container.add_child(b)
	
	asteroid_selector_label.text = str("Asteroid Selector (",buttons_container.get_child_count(),")")

func _on_neo_api_request_request_completed(result: int, response_code: int, _headers: PackedStringArray, body: PackedByteArray) -> void:
	if result != HTTPRequest.RESULT_SUCCESS or response_code != 200:
		print("API Request Failed! Code: ", response_code); return
	
	var parsed_result = JSON.parse_string(body.get_string_from_utf8())

	if typeof(parsed_result) != TYPE_DICTIONARY:
		print("Error: Parsed JSON is not a Dictionary."); return

	var data = parsed_result
	print("Successfully parsed JSON data.")
	
	var new_asteroids_list = data["near_earth_objects"]
	live_asteroid_database.append_array(new_asteroids_list)
	print("Total asteroids in database: ", live_asteroid_database.size())
	
	if data.has("links") and data["links"].has("next"):
		self.next_page_url = data["links"]["next"]
	else:
		self.next_page_url = ""
	
	if not new_asteroids_list.is_empty() and selected_asteroid_data.is_empty():
		selected_asteroid_data = new_asteroids_list[0]
	
	add_asteroid_buttons(new_asteroids_list)

func _on_load_more_button_pressed() -> void:
	if not next_page_url.is_empty():
		print("Requesting next page of data...")
		neo_api_request.request(next_page_url)
	else:
		print("No more pages to load.")
		# Consider getting a reference to the button in _ready to avoid using get_node here.
		# For example: @onready var load_more_button = $Path/To/Button
		# Then you can just do: load_more_button.disabled = true
		$HUD/Control/HBoxContainer/MarginContainer/VBoxContainer/LoadMoreButton.disabled = true

func _on_asteroid_button_selected(asteroid_info: Dictionary):
	launch_button.disabled = false
	selected_asteroid_data = asteroid_info
	print("Selected Asteroid: ", selected_asteroid_data["name"])

func _on_angle_slider_value_changed(value: float) -> void:
	var angle_label = $HUD/Control/HBoxContainer/VBoxContainer/HBoxContainer/AngleLabel
	angle_label.text = str("(", "%.1f" % value, "°)")
	angle = value
