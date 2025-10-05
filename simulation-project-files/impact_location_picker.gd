extends Node3D
class_name ImpactLocationPicker

@export var camera: Camera3D
@export var earth: StaticBody3D
@onready var markers: Node = $"../Earth/Markers"
@export var crosshair: Control

var selected_impact_point: Vector3
var is_picking_mode = true

signal impact_location_selected(world_position: Vector3, surface_normal: Vector3)

func _ready():
	# Make sure Earth has collision
	pass

func enable_picking_mode():
	is_picking_mode = true
	Input.set_default_cursor_shape(Input.CURSOR_CROSS)

func disable_picking_mode():
	is_picking_mode = false
	Input.set_default_cursor_shape(Input.CURSOR_ARROW)

func _input(event):
	if not is_picking_mode:
		return
		
	if event is InputEventMouseButton and event.pressed and event.button_index == MOUSE_BUTTON_LEFT:
		pick_location_at_mouse()

func pick_location_at_mouse():
	var mouse_pos = get_viewport().get_mouse_position()
	var ray_from = camera.project_ray_origin(mouse_pos)
	var ray_dir = camera.project_ray_normal(mouse_pos)
	
	var space_state = get_world_3d().direct_space_state
	var query = PhysicsRayQueryParameters3D.create(ray_from, ray_from + ray_dir * 1000)
	query.collision_mask = 1  # Make sure Earth is on layer 1
	
	var result = space_state.intersect_ray(query)
	
	if result:
		delete_impact_markers()
		
		selected_impact_point = result.position
		var surface_normal = result.normal
		
		# Visual feedback - spawn a marker
		create_impact_marker(selected_impact_point)
		
		# Emit signal for other systems to use
		impact_location_selected.emit(selected_impact_point, surface_normal)
		
		#disable_picking_mode()

func create_impact_marker(position: Vector3):
	# Create a small sphere or crosshair at impact point
	var marker = MeshInstance3D.new()
	var sphere = SphereMesh.new()
	var earth_radius_km = 6371.0
	var scale_factor = 10 / earth_radius_km
	sphere.radius = 265.13992873993 * scale_factor
	sphere.height = sphere.radius*2
	marker.mesh = sphere
	
	# Create material for visibility
	var material = StandardMaterial3D.new()
	material.albedo_color = Color.RED
	material.emission_enabled = true
	material.emission = Color.RED
	material.transparency = BaseMaterial3D.TRANSPARENCY_ALPHA
	material.albedo_color.a = 0.5
	marker.material_override = material
	
	markers.add_child(marker)
	marker.global_position = position

func delete_impact_markers():
	for i in markers.get_children():
		i.queue_free()
