import React from 'react';
import type { UserListItem } from '../../types/admin';

// Mock data for demonstration
const MOCK_USERS: UserListItem[] = [
  {
    id: '1',
    email: 'john.doe@example.com',
    created_at: '2025-01-15T10:30:00Z',
    last_sign_in: '2025-02-07T14:22:00Z',
    role: 'user',
    is_banned: false
  },
  {
    id: '2',
    email: 'jane.smith@example.com',
    created_at: '2025-01-18T09:15:00Z',
    last_sign_in: '2025-02-08T11:45:00Z',
    role: 'user',
    is_banned: false
  },
  {
    id: '3',
    email: 'admin@example.com',
    created_at: '2025-01-10T08:00:00Z',
    last_sign_in: '2025-02-08T16:30:00Z',
    role: 'admin',
    is_banned: false
  },
  {
    id: '4',
    email: 'banned.user@example.com',
    created_at: '2025-01-20T11:20:00Z',
    last_sign_in: '2025-01-25T13:10:00Z',
    role: 'user',
    is_banned: true
  }
];

const UserList: React.FC = () => {
  const [users, setUsers] = React.useState<UserListItem[]>(MOCK_USERS);

  React.useEffect(() => {
    // This would be replaced with your actual API call
    const fetchUsers = async () => {
      try {
        // Replace with your API call
        // const response = await fetch('/api/admin/users');
        // const data = await response.json();
        // setUsers(data);
        
        // Using mock data for now
        setUsers(MOCK_USERS);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead>
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Email
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Role
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Joined
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {users.map((user) => (
            <tr key={user.id}>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{user.email}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                  {user.role}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  user.is_banned 
                    ? 'bg-red-100 text-red-800'
                    : 'bg-green-100 text-green-800'
                }`}>
                  {user.is_banned ? 'Banned' : 'Active'}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {new Date(user.created_at).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserList;