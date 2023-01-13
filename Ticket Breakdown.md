#Ticket Breakdown

### Ticket 1:

Title: Add custom Agent ID to Agent table
- Description: Add a new column to the Agents table in the database to store a custom Agent ID provided by the Facility.
- Acceptance Criteria:
    - The new column, "custom_agent_id", should be able to accept alphanumeric characters of a maximum length of 20.
    - A default value of null should be set for existing rows in the table.
- Time/Effort Estimate: 2 hours
- Implementation Details:
    - Use a database migration to add the new column to the Agents table.
    - Update the model for the Agent table to include the new custom_agent_id field.
    - Add validation to ensure that the custom_agent_id is alphanumeric and has a max length of 20.

### Ticket 2:

- Title: Update getShiftsByFacility function
- Description: Update the function to retrieve the custom Agent ID from the database instead of the internal database id when generating the list of Shifts.
- Acceptance Criteria:
    - The function should return the custom Agent ID in the Shift metadata when it is available.
    - If the custom Agent ID is not available, the internal database id should be used instead.
- Time/Effort Estimate: 1 hour
- Implementation Details:
    - Update the SQL query used in the function to retrieve the custom Agent ID from the Agents table.
    - Update the function to check for the existence of the custom Agent ID before returning it.

### Ticket 3:

- Title: Update generateReport function
- Description: Update the function to use the custom Agent ID when generating the PDF report for the Facility.
- Acceptance Criteria:
    - The function should use the custom Agent ID when it is available, otherwise it should use the internal database id.
    - The function should continue to generate a PDF report that includes the Agent's hours worked.
- Time/Effort Estimate: 1 hour
- Implementation Details:
    - Update the function to check for the existence of the custom Agent ID before using it.
    - Update the PDF template to use the custom Agent ID if it is available.

### Ticket 4:

- Title: Add Facility Admin Interface for managing custom Agent ID
- Description: Build an administrative interface for Facility to manage their Agent's custom Agent ID.
- Acceptance Criteria:
    - The interface should allow Facility to view a list of their Agent's and the custom Agent ID's associated with them.
    - The interface should allow Facility to add/update custom Agent ID for their Agent's
    - The interface should be accessible only to Facility Admins.
- Time/Effort Estimate: 4 hours
- Implementation Details:
    - Create a new endpoint for Facility admin to view/edit Agent's custom Agent ID's.
    - Create a new view for Facility admin to manage Agent's custom Agent ID's
    - Implement access control to make sure only Facility Admins can access the view.

### Ticket 5:

- Title: Testing and Deployment
- Description: Verify the changes made to the system and deploy it to production.
- Acceptance Criteria:
    - All the functionalities should work as expected.
    - System should be stable in production.
- Time/Effort Estimate: 2 hours
- Implementation Details:
    - Write test cases for the new functionalities.
    - Run test cases on the development environment.