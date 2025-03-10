import React from 'react';
import {
  Box,
  Paper,
  Typography,
  IconButton,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
  Popover,
} from '@mui/material';
import {
  Info as InfoIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  Check as CheckIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { useNotificationStore, type Notification } from '../../stores/notificationStore';
import { formatDistanceToNow } from 'date-fns';

const NotificationIcon: React.FC<{ type: Notification['type'] }> = ({ type }) => {
  const icons = {
    info: <InfoIcon color="info" fontSize="small" />,
    success: <CheckCircleIcon color="success" fontSize="small" />,
    warning: <WarningIcon color="warning" fontSize="small" />,
    error: <ErrorIcon color="error" fontSize="small" />
  };
  return icons[type];
};

const NotificationDropdown: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose
}) => {
  const { notifications, markAsRead, markAllAsRead, removeNotification, clearAll } = useNotificationStore();

  const handleMarkAsRead = (id: string) => {
    markAsRead(id);
  };

  const handleRemove = (id: string) => {
    removeNotification(id);
  };

  if (!isOpen) return null;

  return (
    <Paper
      elevation={4}
      sx={{
        position: 'absolute',
        right: 0,
        mt: 1,
        width: 320,
        maxWidth: '100%',
        borderRadius: 2,
        overflow: 'hidden',
        zIndex: 'tooltip',
      }}
    >
      {/* Header */}
      <Box
        sx={{
          p: 2,
          borderBottom: 1,
          borderColor: 'divider',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h6">Notifications</Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              size="small"
              startIcon={<CheckIcon />}
              onClick={markAllAsRead}
              sx={{ textTransform: 'none' }}
            >
              Mark all read
            </Button>
            <Button
              size="small"
              startIcon={<DeleteIcon />}
              onClick={clearAll}
              sx={{ textTransform: 'none' }}
            >
              Clear all
            </Button>
          </Box>
        </Box>
      </Box>

      {/* Notifications List */}
      <Box sx={{ maxHeight: 400, overflow: 'auto' }}>
        {notifications.length === 0 ? (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Typography color="text.secondary">
              No notifications
            </Typography>
          </Box>
        ) : (
          <List disablePadding>
            {notifications.map((notification, index) => (
              <React.Fragment key={notification.id}>
                {index > 0 && <Divider />}
                <ListItem
                  sx={{
                    bgcolor: notification.read ? 'background.paper' : 'action.hover',
                    '&:hover': {
                      bgcolor: 'action.hover',
                    },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    <NotificationIcon type={notification.type} />
                  </ListItemIcon>
                  <ListItemText
                    primary={notification.message}
                    secondary={formatDistanceToNow(notification.createdAt, { addSuffix: true })}
                    primaryTypographyProps={{
                      variant: 'body2',
                      color: 'text.primary',
                    }}
                    secondaryTypographyProps={{
                      variant: 'caption',
                      color: 'text.secondary',
                    }}
                  />
                  <ListItemSecondaryAction>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      {!notification.read && (
                        <IconButton
                          size="small"
                          onClick={() => handleMarkAsRead(notification.id)}
                          color="primary"
                        >
                          <CheckIcon fontSize="small" />
                        </IconButton>
                      )}
                      <IconButton
                        size="small"
                        onClick={() => handleRemove(notification.id)}
                        color="default"
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </ListItemSecondaryAction>
                </ListItem>
              </React.Fragment>
            ))}
          </List>
        )}
      </Box>
    </Paper>
  );
};

export default NotificationDropdown;