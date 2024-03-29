import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Card,
  Container,
  Divider,
  Grid,
  LinearProgress,
  Pagination,
  Stack,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useGetTaskslistsWithPaginateQuery } from "../state/tasksApiSlice";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { usePagination } from "../navigation/usePagination";
import { useDispatch, useSelector } from "react-redux";
import {
  createTasklist,
  deleteTasklist,
  selectTasklist,
  setTasklist,
} from "../state/tasklistSlice";
import { useNavigate } from "react-router-dom";

export const Tasklists = () => {
  const { currentPage, handlePageChange, calculateLastPage } = usePagination();
  const { isLoading, data } = useGetTaskslistsWithPaginateQuery(currentPage);
  const [expanded, setExpanded] = useState(false);
  const handlePanelChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const storedTasklist = useSelector(selectTasklist);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  if (isLoading) {
    return <LinearProgress />;
  }

  const summary = (tasklist) => (
    <Stack
      direction="row"
      gap={4}
      divider={<Divider orientation="vertical" flexItem />}
      alignItems="center"
    >
      <Typography variant="h6">{tasklist.title}</Typography>
      <Typography variant="body2" color="text.secondary">
        {tasklist.status}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {tasklist.description === "" ? "Nincs megadva" : tasklist.description}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {tasklist.tasks.length || "Nincsenek feladatok"}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        L:{" "}
        {new Date(tasklist.createdAt).toLocaleDateString("hu-HU", {
          hour: "numeric",
          minute: "numeric",
          second: "numeric",
        })}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        M:{" "}
        {new Date(tasklist.updatedAt).toLocaleDateString("hu-HU", {
          hour: "numeric",
          minute: "numeric",
          second: "numeric",
        })}
      </Typography>
    </Stack>
  );

  const details = (tasklist) => (
    <Stack>
      <Typography variant="body1">Cím: {tasklist.title}</Typography>
      <Typography variant="body2" color="text.secondary">
        Státusz: {tasklist.status}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Leírás:{" "}
        {tasklist.description === "" ? "Nincs megadva" : tasklist.description}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Létrehozás dátuma:{" "}
        {new Date(tasklist.createdAt).toLocaleDateString("hu-HU", {
          hour: "numeric",
          minute: "numeric",
          second: "numeric",
        })}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Utolsó módosítás dátuma:{" "}
        {new Date(tasklist.updatedAt).toLocaleDateString("hu-HU", {
          hour: "numeric",
          minute: "numeric",
          second: "numeric",
        })}
      </Typography>
      <Typography variant="body2" color="text.secondary"></Typography>
      <Typography variant="body2" color="text.secondary">
        Összpontszám:{" "}
        {tasklist.tasks.reduce((acc, task) => acc + task.points, 0)}
      </Typography>
    </Stack>
  );

  const tasks = (tasklist) =>
    tasklist.tasks.map((task) => (
      <Grid item xs={4} key={task.id}>
        <Card variant="outlined">
          <Stack padding={2}>
            <Typography variant="body1">{task.title}</Typography>
            <Typography variant="body2" color="text.secondary">
              Feladatleírás: {task.description}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Megjegyzés: {!task.notes ? "Nincs megadva" : task.notes}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Pontszám: {task.points}
            </Typography>
          </Stack>
        </Card>
      </Grid>
    ));

  const tasklists = data.data.map((tasklist) => (
    <Card key={tasklist.id}>
      <Stack direction="row">
        <Accordion
          TransitionProps={{ unmountOnExit: true }}
          variant="outlined"
          expanded={expanded === tasklist.id}
          onChange={handlePanelChange(tasklist.id)}
          sx={{
            flex: 1,
          }}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            {summary(tasklist)}
          </AccordionSummary>
          <AccordionDetails>
            <Stack spacing={4}>
              <Stack gap={1}>
                <Typography variant="h6">Részletek</Typography>
                <Divider />
                {details(tasklist)}
              </Stack>
              <Stack gap={1}>
                <Typography variant="h6">Feladatok</Typography>
                {tasklist.tasks.length === 0 && (
                  <Typography variant="body1"> Nincs megadva</Typography>
                )}
                <Grid container spacing={2}>
                  {tasks(tasklist)}
                </Grid>
              </Stack>
            </Stack>
          </AccordionDetails>
        </Accordion>
        {(!storedTasklist ||
          (storedTasklist && tasklist.id !== storedTasklist.id)) && (
          <Button
            color="primary"
            disabled={storedTasklist}
            onClick={() => {
              navigate("/szerkesztes", { replace: true });
              dispatch(setTasklist(tasklist));
            }}
          >
            Szerkeszt
          </Button>
        )}
        {storedTasklist && tasklist.id === storedTasklist.id && (
          <Button
            color="secondary"
            onClick={() => dispatch(deleteTasklist(tasklist))}
          >
            Szerkesztés alatt
          </Button>
        )}
      </Stack>
    </Card>
  ));

  return (
    <Container>
      <Stack marginTop={2} gap={2}>
        <Typography variant="h5">Feladatsoraim</Typography>
        <Stack direction="row">
          <Stack
            flex={1}
            spacing={4}
            direction="row"
            alignItems="center"
            divider={<Divider orientation="vertical" flexItem />}
            marginLeft={2}
          >
            <Typography variant="overline">Cím</Typography>
            <Typography variant="overline">Státusz</Typography>
            <Typography variant="overline">Leírás</Typography>
            <Typography variant="overline">Feladatok száma</Typography>
            <Typography variant="overline">Létrehozás dátuma</Typography>
            <Typography variant="overline">Utolsó módosítás dátuma</Typography>
          </Stack>
          <Button
            color="primary"
            variant="outlined"
            onClick={() => {
              navigate("/szerkesztes", { replace: true });
              dispatch(createTasklist());
            }}
          >
            Új feladatsor
          </Button>
        </Stack>
        <Stack gap={2}>{tasklists}</Stack>
      </Stack>
      <Stack alignItems="center" marginTop={3}>
        <Pagination
          count={calculateLastPage(data)}
          onChange={handlePageChange}
        />
      </Stack>
    </Container>
  );
};
