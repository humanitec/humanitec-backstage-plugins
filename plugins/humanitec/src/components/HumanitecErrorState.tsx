import { Typography } from '@material-ui/core';

export function HumanitecErrorState({ error }: { error: Error }) {
  return <Typography color="error">{error.message}</Typography>
}
