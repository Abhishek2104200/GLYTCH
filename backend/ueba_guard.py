def validate_action(action_type, vehicle_data):
    """
    Simulates a User Entity Behavior Analytics (UEBA) check.
    Returns: (is_safe: bool, reason: str)
    """
    temp = vehicle_data.get("temp", 0)
    
    if action_type == "book_service":
        # Rule: Only auto-book if the car is actually overheating (>110C)
        if temp > 110:
            return True, "Safety Check Passed: High temperature confirmed."
        else:
            return False, "Safety Check Failed: Temperature is normal, booking not authorized."
            
    return True, "Action approved."