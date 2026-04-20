import { useSelector } from "react-redux";
import Avatar from "@mui/material/Avatar";
import Badge from "@mui/material/Badge";
import { styled } from "@mui/material/styles";

const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    backgroundColor: "#44b700",
    color: "#44b700",
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
  },
}));

export default function UserAvatar({ size = 40 }) {
  const user = useSelector((state) => state.user.currentUser);

  const imgSrc = user?.avatarUrl
    ? `https://localhost:7185/ProfileImages/${user.avatarUrl}`
    : null;

  return (
    <StyledBadge
      overlap="circular"
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      variant="dot"
    >
      <Avatar
        src={imgSrc}
        sx={{
          width: size,
          height: size,
        }}
      >
        {!imgSrc && user?.name?.[0]}
      </Avatar>
    </StyledBadge>
  );
}