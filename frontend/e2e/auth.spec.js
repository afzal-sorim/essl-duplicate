import { test, expect } from '@playwright/test';

const API_BASE = 'http://localhost:9090/api/v1/user';

const mockUser = {
  id: 1,
  firstname: 'John',
  lastname: 'Doe',
  email: 'john@example.com',
  dob: '1995-06-15',
  age: 31,
  password: 'secret123',
  phone: '1234567890',
  address: '123 Main St',
};

test.describe('Login Page', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should render login form with heading, inputs and button', async ({ page }) => {
    await expect(page.locator('h2')).toHaveText('Sign in to your account');
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await expect(page.locator('button:has-text("Login")')).toBeVisible();
  });

  test('should show error message on invalid credentials', async ({ page }) => {
    await page.route(`${API_BASE}/get?email=*`, async (route) => {
      await route.fulfill({
        status: 401,
        body: 'Invalid email or password',
      });
    });

    await page.fill('input[type="email"]', 'wrong@test.com');
    await page.fill('input[type="password"]', 'badpass');
    await page.click('button:has-text("Login")');

    await expect(page.locator('text=Invalid email or password')).toBeVisible();
  });

  test('should navigate to home on successful login', async ({ page }) => {
    await page.route(`${API_BASE}/get?email=john@example.com&password=secret123`, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockUser),
      });
    });

    await page.fill('input[type="email"]', 'john@example.com');
    await page.fill('input[type="password"]', 'secret123');
    await page.click('button:has-text("Login")');

    await expect(page.locator('h1')).toContainText('Welcome, John Doe!');
    await expect(page.locator('text=You are successfully logged in.')).toBeVisible();
  });

  test('should display registration link on login page', async ({ page }) => {
    await expect(page.locator('text=Click here to register')).toBeVisible();
  });

  test('should navigate to registration page via link', async ({ page }) => {
    await page.click('a[href="/register"]');
    await expect(page).toHaveURL('/register');
    await expect(page.locator('h2')).toHaveText('Registration');
  });
});

test.describe('Registration Page', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/register');
  });

  test('should render registration form with all fields', async ({ page }) => {
    await expect(page.locator('h2')).toHaveText('Registration');
    await expect(page.locator('input[placeholder="Firstname"]')).toBeVisible();
    await expect(page.locator('input[placeholder="Lastname"]')).toBeVisible();
    await expect(page.locator('input[placeholder="Email"]')).toBeVisible();
    await expect(page.locator('input[placeholder="Password"]')).toBeVisible();
    await expect(page.locator('input[type="date"]')).toBeVisible();
    await expect(page.locator('input[placeholder="Phone"]')).toBeVisible();
    await expect(page.locator('input[placeholder="Address"]')).toBeVisible();
    await expect(page.locator('button:has-text("Register")')).toBeVisible();
  });

  test('should show success message on successful registration', async ({ page }) => {
    await page.route(`${API_BASE}/add`, async (route) => {
      await route.fulfill({
        status: 200,
        body: 'User registered successfully',
      });
    });

    await page.fill('input[placeholder="Firstname"]', 'Jane');
    await page.fill('input[placeholder="Lastname"]', 'Smith');
    await page.fill('input[placeholder="Email"]', 'jane@test.com');
    await page.fill('input[placeholder="Password"]', 'pass123');
    await page.fill('input[type="date"]', '1998-03-22');
    await page.fill('input[placeholder="Phone"]', '9876543210');
    await page.fill('input[placeholder="Address"]', '456 Oak Ave');
    await page.click('button:has-text("Register")');

    await expect(page.locator('h1')).toHaveText('Registration Successful!');
    await expect(page.locator('a[href="/"]')).toBeVisible();
  });

  test('should show error on duplicate email', async ({ page }) => {
    await page.route(`${API_BASE}/add`, async (route) => {
      await route.fulfill({
        status: 409,
        body: 'email already taken',
      });
    });

    await page.fill('input[placeholder="Firstname"]', 'John');
    await page.fill('input[placeholder="Lastname"]', 'Doe');
    await page.fill('input[placeholder="Email"]', 'existing@test.com');
    await page.fill('input[placeholder="Password"]', 'pass123');
    await page.fill('input[type="date"]', '1995-06-15');
    await page.click('button:has-text("Register")');

    await expect(page.locator('text=Registration failed')).toBeVisible();
  });

  test('should navigate back to login via link', async ({ page }) => {
    await page.click('a[href="/"]');
    await expect(page).toHaveURL('/');
    await expect(page.locator('h2')).toHaveText('Sign in to your account');
  });
});

test.describe('Home Page', () => {

  test.beforeEach(async ({ page }) => {
    await page.route(`${API_BASE}/get?email=john@example.com&password=secret123`, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockUser),
      });
    });
    await page.goto('/');
    await page.fill('input[type="email"]', 'john@example.com');
    await page.fill('input[type="password"]', 'secret123');
    await page.click('button:has-text("Login")');
  });

  test('should display welcome message with user firstname', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Welcome, John Doe!');
    await expect(page.locator('nav')).toContainText('Welcome, John!');
  });

  test('should show dashboard card with email', async ({ page }) => {
    await expect(page.locator('.dashboard-card')).toBeVisible();
    await expect(page.locator('.dashboard-card')).toContainText('john@example.com');
  });

  test('should open user menu on icon click', async ({ page }) => {
    await page.locator('.user-icon').click();
    await expect(page.locator('.custom-menu')).toBeVisible();
    await expect(page.locator('.custom-menu')).toContainText('Profile');
    await expect(page.locator('.custom-menu')).toContainText('Logout');
  });

  test('should navigate to profile page from menu', async ({ page }) => {
    await page.locator('.user-icon').click();
    await page.locator('li:has-text("Profile")').click();
    await expect(page).toHaveURL('/profile');
  });

  test('should logout and return to login page', async ({ page }) => {
    await page.locator('.user-icon').click();
    await page.locator('li:has-text("Logout")').click();
    await expect(page.locator('h2')).toHaveText('Sign in to your account');
  });
});

test.describe('Profile Page', () => {

  test.beforeEach(async ({ page }) => {
    await page.route(`${API_BASE}/get?email=john@example.com&password=secret123`, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockUser),
      });
    });
    await page.route(`${API_BASE}/profile?email=john@example.com`, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockUser),
      });
    });
    await page.goto('/');
    await page.fill('input[type="email"]', 'john@example.com');
    await page.fill('input[type="password"]', 'secret123');
    await page.click('button:has-text("Login")');
    await page.locator('.user-icon').click();
    await page.locator('li:has-text("Profile")').click();
  });

  test('should display Profile Information heading', async ({ page }) => {
    await expect(page.locator('h1')).toHaveText('Profile Information');
  });

  test('should show user avatar initials', async ({ page }) => {
    await expect(page.locator('.profile-avatar')).toBeVisible();
    await expect(page.locator('.profile-avatar')).toHaveText('JD');
  });

  test('should display all user profile fields', async ({ page }) => {
    await expect(page.locator('.profile-details')).toBeVisible();
    await expect(page.locator('.profile-row:has-text("First Name")')).toContainText('John');
    await expect(page.locator('.profile-row:has-text("Last Name")')).toContainText('Doe');
    await expect(page.locator('.profile-row:has-text("Email")')).toContainText('john@example.com');
    await expect(page.locator('.profile-row:has-text("Phone")')).toContainText('1234567890');
  });

  test('should go back to home when clicking back arrow', async ({ page }) => {
    await page.locator('.user-icon').click();
    await expect(page).toHaveURL('/');
  });

  test('should display error if profile fetch fails', async ({ page }) => {
    await page.route(`${API_BASE}/profile?email=john@example.com`, async (route) => {
      await route.fulfill({
        status: 500,
        body: 'Server error',
      });
    });
    await page.goto('/profile');
    await expect(page.locator('text=Failed to load profile')).toBeVisible();
  });
});
