import React from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Grid,
  IconButton,
  Avatar,
  List,
  ListItem,
  ListItemText,
  Divider,
  useTheme,
} from '@mui/material';
import {
  Favorite as HeartIcon,
  GitHub as GitHubIcon,
  Twitter as TwitterIcon,
  LinkedIn as LinkedInIcon,
} from '@mui/icons-material';

const FooterLink = ({ to, children }: { to: string; children: React.ReactNode }) => (
  <Link
    to={to}
    style={{ textDecoration: 'none', color: 'inherit' }}
  >
    <Typography
      variant="body2"
      sx={{
        '&:hover': {
          color: 'primary.main',
        },
      }}
    >
      {children}
    </Typography>
  </Link>
);

const SocialIcon = ({ href, icon: Icon }: { href: string; icon: React.ElementType }) => (
  <IconButton
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    sx={{
      bgcolor: 'background.paper',
      '&:hover': {
        bgcolor: 'primary.light',
        color: 'primary.main',
      },
    }}
  >
    <Icon />
  </IconButton>
);

const Footer: React.FC = () => {
  const theme = useTheme();

  return (
    <Box component="footer" sx={{ bgcolor: 'grey.50' }}>
      <Container maxWidth="xl">
        {/* Main Footer Content */}
        <Box py={8} borderBottom={1} borderColor="divider">
          <Grid container spacing={6}>
            {/* Brand Section */}
            <Grid item xs={12} md={4}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <Avatar sx={{ bgcolor: 'primary.main', width: 40, height: 40 }}>
                  <HeartIcon />
                </Avatar>
                <Typography variant="h5" fontWeight="bold" color="text.primary">
                  HeartGuard
                </Typography>
              </Box>
              <Typography
                variant="body1"
                color="text.secondary"
                sx={{ mb: 3 }}
              >
                Empowering healthcare with AI-driven heart disease prediction technology.
              </Typography>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <SocialIcon href="https://github.com" icon={GitHubIcon} />
                <SocialIcon href="https://twitter.com" icon={TwitterIcon} />
                <SocialIcon href="https://linkedin.com" icon={LinkedInIcon} />
              </Box>
            </Grid>

            {/* Navigation Section */}
            <Grid item xs={12} md={4}>
              <Box display="flex" justifyContent={{ xs: 'flex-start', md: 'center' }}>
                <Box>
                  <Typography
                    variant="subtitle1"
                    color="text.primary"
                    fontWeight="bold"
                    gutterBottom
                  >
                    Quick Links
                  </Typography>
                  <List disablePadding>
                    <ListItem disablePadding sx={{ pb: 1 }}>
                      <FooterLink to="/">Home</FooterLink>
                    </ListItem>
                    <ListItem disablePadding sx={{ pb: 1 }}>
                      <FooterLink to="/about">About</FooterLink>
                    </ListItem>
                    <ListItem disablePadding>
                      <FooterLink to="/predict">Assessment</FooterLink>
                    </ListItem>
                  </List>
                </Box>
              </Box>
            </Grid>

            {/* Legal Section */}
            <Grid item xs={12} md={4}>
              <Box display="flex" justifyContent={{ xs: 'flex-start', md: 'flex-end' }}>
                <Box>
                  <Typography
                    variant="subtitle1"
                    color="text.primary"
                    fontWeight="bold"
                    gutterBottom
                  >
                    Legal
                  </Typography>
                  <List disablePadding>
                    <ListItem disablePadding sx={{ pb: 1 }}>
                      <FooterLink to="/privacy">Privacy Policy</FooterLink>
                    </ListItem>
                    <ListItem disablePadding>
                      <FooterLink to="/terms">Terms of Service</FooterLink>
                    </ListItem>
                  </List>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Box>

        {/* Bottom Bar */}
        <Box py={3}>
          <Typography
            variant="body2"
            color="text.secondary"
            align="center"
          >
            © {new Date().getFullYear()} HeartGuard AI. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;