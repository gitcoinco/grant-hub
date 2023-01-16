import { Box } from "@chakra-ui/react";

export default function StatCard({
  heading,
  value,
  bg,
  border,
}: {
  heading: string;
  value: string | number;
  bg?: string;
  border?: boolean;
}) {
  return (
    <Box
      p={3}
      className={`${bg ? `bg-${bg}` : ""} border-grey-100 mx-2`}
      borderWidth={border ? "1px" : "0px"}
      borderRadius="md"
      minWidth="193px"
      height="88px"
    >
      <Box mb={2}>
        <span className="text-[14px] text-gitcoin-grey-500 font-semibold">
          {heading}
        </span>
      </Box>
      <Box mb={2}>
        <span className="text-[24px] text-gitcoin-grey-400">{value}</span>
      </Box>
    </Box>
  );
}
