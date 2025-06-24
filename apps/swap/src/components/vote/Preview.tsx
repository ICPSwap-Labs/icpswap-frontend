import { Typography, Box } from "components/Mui";
import { Markdown } from "components/markdown/BaseMarkdown";

export default function Preview({ title, content }: { title: string | undefined; content: string | undefined }) {
  return (
    <Box>
      <Typography color="text.primary" fontWeight={700} fontSize="26px" sx={{ marginTop: "20px" }}>
        {title}
      </Typography>

      {content ? (
        <>
          <Box mt="20px">
            <Markdown content={content} />
          </Box>
        </>
      ) : null}
    </Box>
  );
}
