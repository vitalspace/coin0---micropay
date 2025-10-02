# Campaign Controller Tests

This directory contains comprehensive tests for the campaigns controller.

## Running Tests

To run the tests, use the following command from the backend directory:

```bash
bun test
```

Or to run tests in watch mode:

```bash
bun test --watch
```

## Recent Updates

**Business Campaign Pricing**: Updated the controller logic to allow business campaigns to have pricing information, making them consistent with product campaigns. Only donation campaigns remain without pricing.

## Test Coverage

The tests cover the following scenarios for the `createCampaign` function:

### ✅ Successful Campaign Creation
- **Donation Campaign**: Tests creating a donation campaign with goal amount
- **Business Campaign**: Tests creating a business campaign with price (both basic and different price scenarios)
- **Product Campaign**: Tests creating a product campaign with price

### ✅ Validation Error Handling
- **Missing Required Fields**: Tests validation when required fields (type, name, description, createdBy) are missing
- **Invalid Campaign Type**: Tests validation when campaign type is not "donation", "business", or "product"

### ✅ Error Scenarios
- **User Not Found**: Tests behavior when the user specified in `createdBy` doesn't exist
- **Database Errors**: Tests error handling when database operations fail

## Test Structure

```
__tests__/
├── mocks/
│   ├── index.ts          # Main mock setup and control functions
│   ├── user.mock.ts      # User model mocks
│   └── campaign.mock.ts  # Campaign model mocks
├── campaigns.controller.test.ts  # Main test file
└── README.md            # This file
```

## Mock System

The tests use a controlled mock system that allows for:

- **Dynamic Behavior**: Change mock behavior between tests (e.g., simulate user not found)
- **Error Simulation**: Trigger database errors for testing error handling
- **Reset Capability**: Reset all mocks to default state before each test

### Mock Control Functions

- `setUserFound(found: boolean)`: Control whether users are found or not
- `setCampaignSaveSuccess(success: boolean, error?: Error)`: Control database operation success/failure
- `resetMocks()`: Reset all mocks to default successful behavior