import { Box } from "components/Mui";

export function AddressBookLabel({ name }: { name: string }) {
  return (
    <Box
      sx={{
        borderRadius: "8px",
        background: "rgba(183, 156, 74, 0.26)",
        padding: "4px 8px",
        color: "#B79C4A",
        fontSize: "12px",
      }}
    >
      {name}
    </Box>
  );
}
