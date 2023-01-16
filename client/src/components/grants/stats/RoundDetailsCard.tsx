import { Box, Spinner } from "@chakra-ui/react";
import { formatDate } from "../../../utils/components";

export default function RoundDetailsCard({ data }: { data: any }) {
  const renderApplicationDate = () => (
    <>
      {formatDate(data.round?.applicationsStartTime)} -{" "}
      {formatDate(data.round?.applicationsEndTime)}
    </>
  );

  // const renderApplicationBadge = () => {
  //   let colorScheme: string | undefined;
  //   switch (applicationData.status) {
  //     case "APPROVED":
  //       colorScheme = "green";
  //       break;
  //     case "REJECTED":
  //       colorScheme = "red";
  //       break;
  //     default:
  //       colorScheme = undefined;
  //       break;
  //   }

  //   return (
  //     <Badge
  //       colorScheme={colorScheme}
  //       className="bg-gitcoin-gray-100"
  //       borderRadius="full"
  //       p={2}
  //     >
  //       <span>{applicationData.status}</span>
  //     </Badge>
  //   );
  // };

  return (
    <Box p={2} className="h-full">
      <Box mb={2}>
        <span className="text-[16px] text-gitcoin-gray-500">
          {data.heading}
        </span>
      </Box>
      {data.round && (
        <div className="flex flex-1 flex-col md:flex-row justify-between">
          <Box className="text-[14px] text-gitcoin-gray-500">
            <div className="mb-1">{data.round?.roundMetadata.name}</div>
            {data.round ? (
              <span className="text-[14px] text-gitcoin-grey-400">
                {renderApplicationDate()}
              </span>
            ) : (
              <Spinner />
            )}
          </Box>
        </div>
      )}
      {/* <Box className="pl-2 mt-2 md:mt-0 text-gitcoin-gray-400">
        {renderApplicationBadge()}
      </Box> */}
    </Box>
  );
}
