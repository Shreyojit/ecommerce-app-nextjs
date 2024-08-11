import { Card, CardContent, Typography } from '@mui/material';

interface CardProps {
  title: string;
  value: number | string;
}

const DashboardCard: React.FC<CardProps> = ({ title, value }) => {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6">{title}</Typography>
        <Typography variant="h4">{value}</Typography>
      </CardContent>
    </Card>
  );
};

export default DashboardCard;
