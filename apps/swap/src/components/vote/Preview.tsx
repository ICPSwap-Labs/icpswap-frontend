import { Typography, Box } from "@mui/material";
import BaseMarkdown from "components/markdown/BaseMarkdown";

export default function Preview({ title, content }: { title: string | undefined; content: string | undefined }) {
  return (
    <Box>
      <Typography color="text.primary" fontWeight={700} fontSize="26px" sx={{ marginTop: "20px" }}>
        {title}
      </Typography>

      {!!content ? (
        <>
          <Box mt="20px">
            <BaseMarkdown content={content} />
          </Box>
        </>
      ) : null}
    </Box>
  );
}
