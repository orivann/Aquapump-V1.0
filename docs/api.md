# API Reference

Complete reference for AquaPump's backend API.

## Overview

AquaPump uses **tRPC** for type-safe API communication between frontend and backend. All APIs are fully typed and validated at compile time.

## Base URL

- **Development**: `http://localhost:8081/api`
- **Production**: `https://your-domain.com/api`

## Authentication

Currently, the API uses Supabase service keys for backend operations. Row-level security (RLS) is enforced at the database level.

## Health Endpoints

### GET /api/health

Check application health status.

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2025-10-17T12:00:00Z",
  "uptime": 3600
}
```

### GET /api/ready

Check if application is ready to serve traffic.

**Response:**
```json
{
  "status": "ready",
  "timestamp": "2025-10-17T12:00:00Z"
}
```

### GET /api

Get API information.

**Response:**
```json
{
  "name": "AquaPump API",
  "version": "1.0.0",
  "endpoints": {
    "health": "/api/health",
    "ready": "/api/ready",
    "trpc": "/api/trpc"
  }
}
```

## tRPC Endpoints

All tRPC procedures are accessed via `/api/trpc/*`.

### Example Procedures

#### example.hi

Simple greeting endpoint for testing.

**Type:** Query

**Frontend Usage:**
```typescript
import { trpc } from '@/lib/trpc';

const { data, isLoading } = trpc.example.hi.useQuery();
console.log(data); // "Hello from tRPC!"
```

**Direct Call:**
```typescript
import { trpcClient } from '@/lib/trpc';

const data = await trpcClient.example.hi.query();
console.log(data); // "Hello from tRPC!"
```

## Pumps API

### pumps.list

Get list of all pumps.

**Type:** Query

**Input:** None

**Output:**
```typescript
{
  id: string;
  name: string;
  model: string;
  status: 'online' | 'offline' | 'maintenance';
  pressure: number;
  flow_rate: number;
  power_consumption: number;
  location: string;
  created_at: string;
  updated_at: string;
}[]
```

**Frontend Usage:**
```typescript
const { data, isLoading, error } = trpc.pumps.list.useQuery();

if (isLoading) return <Text>Loading...</Text>;
if (error) return <Text>Error: {error.message}</Text>;

return (
  <View>
    {data.map(pump => (
      <Text key={pump.id}>{pump.name}</Text>
    ))}
  </View>
);
```

### pumps.get

Get a single pump by ID.

**Type:** Query

**Input:**
```typescript
{
  id: string;
}
```

**Output:**
```typescript
{
  id: string;
  name: string;
  model: string;
  status: 'online' | 'offline' | 'maintenance';
  pressure: number;
  flow_rate: number;
  power_consumption: number;
  location: string;
  created_at: string;
  updated_at: string;
}
```

**Frontend Usage:**
```typescript
const { data } = trpc.pumps.get.useQuery({ 
  id: 'pump-uuid-here' 
});
```

### pumps.create

Create a new pump.

**Type:** Mutation

**Input:**
```typescript
{
  name: string;
  model: string;
  status: 'online' | 'offline' | 'maintenance';
  pressure: number;
  flow_rate: number;
  power_consumption: number;
  location: string;
}
```

**Output:**
```typescript
{
  id: string;
  name: string;
  model: string;
  status: 'online' | 'offline' | 'maintenance';
  pressure: number;
  flow_rate: number;
  power_consumption: number;
  location: string;
  created_at: string;
  updated_at: string;
}
```

**Frontend Usage:**
```typescript
const createMutation = trpc.pumps.create.useMutation({
  onSuccess: (data) => {
    console.log('Created pump:', data);
  },
  onError: (error) => {
    console.error('Error:', error.message);
  }
});

const handleCreate = () => {
  createMutation.mutate({
    name: 'Pump A1',
    model: 'AquaPump Pro 5000',
    status: 'online',
    pressure: 4.5,
    flow_rate: 120.5,
    power_consumption: 2.3,
    location: 'Building A'
  });
};
```

### pumps.update

Update an existing pump.

**Type:** Mutation

**Input:**
```typescript
{
  id: string;
  name?: string;
  model?: string;
  status?: 'online' | 'offline' | 'maintenance';
  pressure?: number;
  flow_rate?: number;
  power_consumption?: number;
  location?: string;
}
```

**Output:**
```typescript
{
  id: string;
  name: string;
  model: string;
  status: 'online' | 'offline' | 'maintenance';
  pressure: number;
  flow_rate: number;
  power_consumption: number;
  location: string;
  created_at: string;
  updated_at: string;
}
```

**Frontend Usage:**
```typescript
const updateMutation = trpc.pumps.update.useMutation();

const handleUpdate = (pumpId: string) => {
  updateMutation.mutate({
    id: pumpId,
    status: 'maintenance',
    pressure: 0,
    flow_rate: 0
  });
};
```

### pumps.delete

Delete a pump.

**Type:** Mutation

**Input:**
```typescript
{
  id: string;
}
```

**Output:**
```typescript
{
  success: boolean;
}
```

**Frontend Usage:**
```typescript
const deleteMutation = trpc.pumps.delete.useMutation();

const handleDelete = (pumpId: string) => {
  if (confirm('Are you sure?')) {
    deleteMutation.mutate({ id: pumpId });
  }
};
```

### pumps.logs.list

Get logs for a pump.

**Type:** Query

**Input:**
```typescript
{
  pumpId: string;
  limit?: number;
}
```

**Output:**
```typescript
{
  id: string;
  pump_id: string;
  event_type: 'start' | 'stop' | 'maintenance' | 'error' | 'warning';
  message: string;
  metadata: Record<string, any>;
  created_at: string;
}[]
```

**Frontend Usage:**
```typescript
const { data: logs } = trpc.pumps.logs.list.useQuery({
  pumpId: 'pump-uuid',
  limit: 50
});
```

### pumps.logs.create

Create a log entry for a pump.

**Type:** Mutation

**Input:**
```typescript
{
  pump_id: string;
  event_type: 'start' | 'stop' | 'maintenance' | 'error' | 'warning';
  message: string;
  metadata?: Record<string, any>;
}
```

**Output:**
```typescript
{
  id: string;
  pump_id: string;
  event_type: 'start' | 'stop' | 'maintenance' | 'error' | 'warning';
  message: string;
  metadata: Record<string, any>;
  created_at: string;
}
```

**Frontend Usage:**
```typescript
const logMutation = trpc.pumps.logs.create.useMutation();

const logEvent = (pumpId: string) => {
  logMutation.mutate({
    pump_id: pumpId,
    event_type: 'maintenance',
    message: 'Scheduled maintenance completed',
    metadata: {
      technician: 'John Doe',
      duration: '2 hours',
      parts_replaced: ['filter', 'seal']
    }
  });
};
```

## Error Handling

### Error Response Format

```typescript
{
  code: string;
  message: string;
  data?: {
    zodError?: ZodError; // For validation errors
    httpStatus?: number;
  }
}
```

### Common Error Codes

- `BAD_REQUEST` - Invalid input (400)
- `UNAUTHORIZED` - Authentication required (401)
- `FORBIDDEN` - Insufficient permissions (403)
- `NOT_FOUND` - Resource not found (404)
- `INTERNAL_SERVER_ERROR` - Server error (500)

### Frontend Error Handling

```typescript
const { data, error } = trpc.pumps.get.useQuery({ id: 'invalid' });

if (error) {
  console.error('Error code:', error.data?.code);
  console.error('Error message:', error.message);
  
  if (error.data?.zodError) {
    // Validation error
    console.error('Validation issues:', error.data.zodError.issues);
  }
}
```

## React Query Integration

tRPC is built on top of React Query, so you get all React Query features:

### Caching

```typescript
// First call: fetches from server
const { data } = trpc.pumps.list.useQuery();

// Second call: returns cached data instantly
const { data } = trpc.pumps.list.useQuery();
```

### Refetching

```typescript
const { data, refetch } = trpc.pumps.list.useQuery();

// Refetch manually
await refetch();

// Refetch on window focus
const { data } = trpc.pumps.list.useQuery(undefined, {
  refetchOnWindowFocus: true
});
```

### Invalidation

```typescript
const utils = trpc.useContext();
const createMutation = trpc.pumps.create.useMutation({
  onSuccess: () => {
    // Invalidate and refetch pumps list
    utils.pumps.list.invalidate();
  }
});
```

### Optimistic Updates

```typescript
const utils = trpc.useContext();
const updateMutation = trpc.pumps.update.useMutation({
  onMutate: async (newData) => {
    // Cancel outgoing refetches
    await utils.pumps.get.cancel({ id: newData.id });
    
    // Snapshot previous value
    const previousData = utils.pumps.get.getData({ id: newData.id });
    
    // Optimistically update
    utils.pumps.get.setData({ id: newData.id }, {
      ...previousData,
      ...newData
    });
    
    return { previousData };
  },
  onError: (err, newData, context) => {
    // Rollback on error
    utils.pumps.get.setData(
      { id: newData.id },
      context?.previousData
    );
  },
  onSettled: (data) => {
    // Refetch after error or success
    utils.pumps.get.invalidate({ id: data.id });
  }
});
```

## Direct Supabase Access

For frontend real-time features:

```typescript
import { supabase } from '@/frontend/lib/supabase';

// Fetch data
const { data, error } = await supabase
  .from('pumps')
  .select('*')
  .order('created_at', { ascending: false });

// Subscribe to changes
const subscription = supabase
  .channel('pumps-changes')
  .on('postgres_changes',
    { event: '*', schema: 'public', table: 'pumps' },
    (payload) => {
      console.log('Change detected:', payload);
    }
  )
  .subscribe();

// Cleanup
subscription.unsubscribe();
```

## Testing APIs

### Using cURL

```bash
# Health check
curl http://localhost:8081/api/health

# tRPC query (GET)
curl "http://localhost:8081/api/trpc/pumps.list?input={}"

# tRPC mutation (POST)
curl -X POST http://localhost:8081/api/trpc/pumps.create \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Pump",
    "model": "Test Model",
    "status": "online",
    "pressure": 4.5,
    "flow_rate": 100,
    "power_consumption": 2.0,
    "location": "Test Location"
  }'
```

### Using Postman

1. Import OpenAPI schema (if available)
2. Set base URL: `http://localhost:8081/api`
3. Use `trpc` prefix for endpoints
4. Set appropriate headers

### Using Browser DevTools

1. Open browser console
2. Use `trpcClient` if exposed globally
3. Call procedures directly:

```javascript
await trpcClient.pumps.list.query();
```

## Rate Limiting

Currently no rate limiting is enforced. Consider adding in production:

- Per-IP rate limiting
- Per-user rate limiting
- Endpoint-specific limits

## API Versioning

Current version: `v1`

Future versions will use path-based versioning:
- `/api/v1/trpc/*`
- `/api/v2/trpc/*`

## Additional Resources

- [tRPC Documentation](https://trpc.io/docs)
- [React Query Documentation](https://tanstack.com/query/latest)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript)
- [Getting Started](getting-started.md)
- [Architecture](architecture.md)
