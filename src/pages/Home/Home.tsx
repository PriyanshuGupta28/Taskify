import { Stack } from "@mui/system";
import React from "react";
import TodoList from "../../components/TodoList/TodoList";

const Home: React.FC = () => {
  return (
    <Stack alignItems="center" justifyContent="center" mt={10}>
      <Stack sx={{ width: { xs: "95%", md: "70%" } }}>
        <TodoList />
      </Stack>
    </Stack>
  );
};

export default Home;
