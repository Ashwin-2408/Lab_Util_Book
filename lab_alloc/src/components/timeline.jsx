import * as React from "react";
import Timeline from "@mui/lab/Timeline";
import TimelineItem from "@mui/lab/TimelineItem";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent from "@mui/lab/TimelineContent";
import TimelineOppositeContent from "@mui/lab/TimelineOppositeContent";
import TimelineDot from "@mui/lab/TimelineDot";
import FastfoodIcon from "@mui/icons-material/Fastfood";
import LaptopMacIcon from "@mui/icons-material/LaptopMac";
import HotelIcon from "@mui/icons-material/Hotel";
import RepeatIcon from "@mui/icons-material/Repeat";
import Typography from "@mui/material/Typography";

export default function CustomizedTimeline() {
  return (
    <Timeline
      sx={{
        flexDirection: "row",
        overflowX: "auto", // Allows horizontal scrolling
      }}
    >
      <TimelineItem
        sx={{
          minWidth: "150px", // Reduce the minimum width of the TimelineItem
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <TimelineOppositeContent
          sx={{
            m: "auto 0",
            textAlign: "center",
          }}
          align="center"
          variant="body2"
          color="text.secondary"
        >
          9:30 am
        </TimelineOppositeContent>
        <TimelineContent
          sx={{
            py: "8px",
            px: 1,
            textAlign: "center",
            maxWidth: "100px",
          }}
        >
          <Typography variant="h6" component="span" noWrap>
            Eat
          </Typography>
          <Typography variant="body2">Because you need strength</Typography>
        </TimelineContent>
      </TimelineItem>
      <TimelineItem
        sx={{
          minWidth: "150px", // Reduce the minimum width of the TimelineItem
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <TimelineOppositeContent
          sx={{
            m: "auto 0",
            textAlign: "center",
          }}
          align="center"
          variant="body2"
          color="text.secondary"
        >
          10:00 am
        </TimelineOppositeContent>
        <TimelineContent
          sx={{
            py: "8px",
            px: 1,
            textAlign: "center",
            maxWidth: "100px",
          }}
        >
          <Typography variant="h6" component="span" noWrap>
            Code
          </Typography>
          <Typography variant="body2">Because it's awesome</Typography>
        </TimelineContent>
        <TimelineContent
          sx={{
            py: "8px",
            px: 1,
            textAlign: "center",
            maxWidth: "100px",
          }}
        >
          <Typography variant="h6" component="span" noWrap>
            Code
          </Typography>
          <Typography variant="body2">Because it's awesome</Typography>
        </TimelineContent>
      </TimelineItem>
      <TimelineItem
        sx={{
          minWidth: "150px", // Reduce the minimum width of the TimelineItem
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <TimelineOppositeContent
          sx={{
            m: "auto 0",
            textAlign: "center",
          }}
          align="center"
          variant="body2"
          color="text.secondary"
        >
          11:30 am
        </TimelineOppositeContent>
        <TimelineContent
          sx={{
            py: "8px",
            px: 1,
            textAlign: "center",
            maxWidth: "100px",
          }}
        >
          <Typography variant="h6" component="span" noWrap>
            Sleep
          </Typography>
          <Typography variant="body2">Because you need to reset</Typography>
        </TimelineContent>
      </TimelineItem>
    </Timeline>
  );
}
