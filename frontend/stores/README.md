# Zustand Stores

This directory contains Zustand stores for state management.

## Auth Store (`authStore.ts`)

Manages authentication state including:
- User authentication status
- User information
- Login, register, logout operations
- Email verification
- Password reset
- Token refresh

### Usage

```tsx
import { useAuthStore } from '@/stores';

function MyComponent() {
  const { isAuthenticated, user, login, logout, loading } = useAuthStore();
  
  const handleLogin = async () => {
    try {
      await login('username', 'password');
    } catch (error) {
      console.error('Login failed:', error);
    }
  };
  
  return (
    <div>
      {isAuthenticated ? (
        <p>Welcome, {user?.username}!</p>
      ) : (
        <button onClick={handleLogin}>Login</button>
      )}
    </div>
  );
}
```

## Eligibility Store (`eligibilityStore.ts`)

Manages loan eligibility state including:
- Personal details
- Financial details
- Loan details
- Eligibility results
- Navigation state

### Usage

```tsx
import { useEligibilityStore } from '@/stores';

function EligibilityForm() {
  const {
    personDetails,
    financialDetails,
    loanDetails,
    setPersonDetails,
    setFinancialDetails,
    setLoanDetails,
    checkEligibility,
    isLoading,
    eligibilityResult,
  } = useEligibilityStore();
  
  const handleSubmit = async () => {
    try {
      await checkEligibility();
      // Eligibility result is now available in eligibilityResult
    } catch (error) {
      console.error('Eligibility check failed:', error);
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
    </form>
  );
}
```

## Migration from Context

To migrate from React Context to Zustand:

1. Replace `useAuth()` hook with `useAuthStore()`
2. Replace `useEligibility()` hook with `useEligibilityStore()`
3. Remove Context Providers from your app layout
4. The stores initialize automatically, no provider needed

