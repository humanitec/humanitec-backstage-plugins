import { Typography } from '@material-ui/core';
import { default as React } from 'react';

export function HumanitecErrorState({ error }: { error: Error }) {
  return <Typography color="error">{error.message}</Typography>
}
