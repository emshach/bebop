import Box from '@mui/material/Box'

export function AccountMain({ user, ...props }) {
  return (
    <Box>
      <h1>Welcome { (user.name || '').split(/\s+/)[0] }</h1>
    </Box>
  )
}
