// TodoList.tsx
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import {
  addTodo,
  deleteTodo,
  fetchTodos,
  updateTodo,
} from "../../firebase/firestore";
import {
  Button,
  TextField,
  Typography,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  IconButton,
} from "@mui/material";
import { Flipper, Flipped } from "react-flip-toolkit";
import { Edit, Delete } from "@mui/icons-material";
import { Stack } from "@mui/system";
import { formatDate } from "../../utilities/utils";
import { Todo } from "../../utilities/types";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import ReplayIcon from "@mui/icons-material/Replay";
import toast, { Toaster } from "react-hot-toast";

const TodoList: React.FC = () => {
  const { user } = useContext(AuthContext);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState("");
  const [editTodoId, setEditTodoId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  useEffect(() => {
    const getTodos = async () => {
      if (user) {
        setIsFetching(true);
        try {
          const fetchedTodos = await fetchTodos(user);
          setTodos(fetchedTodos);
        } catch (error) {
          console.error("Error fetching todos:", error);
          toast.error("Failed to fetch todos.", {
            style: {
              borderRadius: "10px",
              background: "#333",
              color: "#fff",
            },
          });
        } finally {
          setIsFetching(false);
        }
      } else {
        setTodos([]);
      }
    };
    getTodos();
  }, [user]);

  //  Adding a New Todo
  const handleAddTodo = async () => {
    if (user && newTodo.trim() !== "") {
      setIsAdding(true);
      try {
        const id = Date.now().toString();
        const currentDate = new Date().toISOString().split("T")[0];

        const todo: Todo = {
          id,
          text: newTodo,
          completed: false,
          userId: user,
          createdAt: new Date(),
          updatedAt: new Date(),
          date: currentDate,
        };

        await addTodo(user, todo);

        setTodos([todo, ...todos]);
        setNewTodo("");
        toast.success("Todo added successfully!", {
          style: {
            borderRadius: "10px",
            background: "#333",
            color: "#fff",
          },
        });
      } catch (error) {
        console.error("Error adding todo:", error);
        toast.error("Failed to add todo.", {
          style: {
            borderRadius: "10px",
            background: "#333",
            color: "#fff",
          },
        });
      } finally {
        setIsAdding(false);
      }
    } else {
      toast.error("Todo cannot be empty.", {
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
      });
    }
  };

  //  Editing a Todo
  const handleEditTodo = (todo: Todo) => {
    setEditTodoId(todo.id);
    setEditText(todo.text);
  };

  // Updating a Todo
  const handleUpdateTodo = async () => {
    if (editTodoId && editText.trim() !== "" && user) {
      setIsUpdating(true);
      try {
        await updateTodo(editTodoId, { text: editText });

        setTodos(
          todos.map((todo) =>
            todo.id === editTodoId
              ? { ...todo, text: editText, updatedAt: new Date() }
              : todo
          )
        );
        setEditTodoId(null);
        setEditText("");
        toast.success("Todo updated successfully!", {
          style: {
            borderRadius: "10px",
            background: "#333",
            color: "#fff",
          },
        });
      } catch (error) {
        console.error("Error updating todo:", error);
        toast.error("Failed to update todo.", {
          style: {
            borderRadius: "10px",
            background: "#333",
            color: "#fff",
          },
        });
      } finally {
        setIsUpdating(false);
      }
    } else {
      toast.error("Todo cannot be empty.", {
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
      });
    }
  };

  //  Completing a Todo
  const handleCompleteTodo = async (todo: Todo) => {
    if (user) {
      setIsUpdating(true);
      try {
        await updateTodo(todo.id, { completed: !todo.completed });

        setTodos(
          todos.map((t) =>
            t.id === todo.id
              ? { ...t, completed: !t.completed, updatedAt: new Date() }
              : t
          )
        );

        toast.success("Todo status updated!", {
          style: {
            borderRadius: "10px",
            background: "#333",
            color: "#fff",
          },
        });
      } catch (error) {
        console.error("Error updating todo status:", error);
        toast.error("Failed to update todo status.", {
          style: {
            borderRadius: "10px",
            background: "#333",
            color: "#fff",
          },
        });
      } finally {
        setIsUpdating(false);
      }
    }
  };

  // Deleting a Todo
  const handleDeleteTodo = async (id: string) => {
    setIsDeleting(true);
    try {
      await deleteTodo(id);
      setTodos(todos.filter((todo) => todo.id !== id));
      toast.success("Todo deleted successfully!", {
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
      });
    } catch (error) {
      console.error("Error deleting todo:", error);
      toast.error("Failed to delete todo.", {
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Stack
      sx={{
        width: "100%",
        borderRadius: 2,
        boxShadow: 3,
        mt: 5,
        p: 3,
      }}
    >
      {/* Toast Container */}
      <Toaster />

      {/* Header */}
      <Stack justifyContent={"space-between"} mb={3}>
        <Typography variant="h4" align="center">
          Todo List
        </Typography>
      </Stack>

      {user ? (
        <>
          {/* Add Todo Section */}
          <Stack
            direction={{ xs: "column", md: "row" }}
            justifyContent="space-between"
            gap={2}
            mb={3}
          >
            <TextField
              variant="outlined"
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              placeholder="Add a new todo"
              fullWidth
              disabled={isAdding}
            />
            <Button
              variant="contained"
              onClick={handleAddTodo}
              sx={{
                whiteSpace: "nowrap",
                padding: "10px 40px",
              }}
              disabled={isAdding}
            >
              {isAdding ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Add Todo"
              )}
            </Button>
          </Stack>

          <Stack
            sx={{
              maxHeight: "800px",
              overflowY: "auto",
              "&::-webkit-scrollbar": {
                width: "5px",
                backgroundColor: "transparent",
              },
              "&::-webkit-scrollbar-thumb": {
                backgroundColor: "#888",
                borderRadius: "3px",
              },
            }}
          >
            {isFetching ? (
              <Stack alignItems="center" mt={4}>
                <CircularProgress />
                <Typography variant="body1" mt={2}>
                  Loading todos...
                </Typography>
              </Stack>
            ) : todos.length === 0 ? (
              <Typography variant="body1" align="center" color="textSecondary">
                No todos found. Add a new todo to get started!
              </Typography>
            ) : (
              <Flipper
                flipKey={todos.map((todo) => todo.id).join(",")}
                spring={{ stiffness: 170, damping: 20 }}
              >
                <List
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 1,
                  }}
                >
                  {todos.map((todo) => (
                    <Flipped key={todo.id} flipId={todo.id}>
                      <ListItem
                        sx={{
                          mb: 1,
                          borderRadius: 1,
                          boxShadow: 1,
                          backgroundColor: todo.completed
                            ? "grey.800"
                            : "grey.800",
                          transition: "0.3s",
                          "&:hover": {
                            boxShadow: 3,
                            backgroundColor: todo.completed
                              ? "green.800"
                              : "grey.700",
                          },
                        }}
                      >
                        {editTodoId === todo.id ? (
                          <>
                            <Stack
                              direction={{ xs: "column", md: "row" }}
                              justifyContent="space-between"
                              alignItems="center"
                              gap={2}
                              sx={{ width: "100%" }}
                            >
                              <TextField
                                variant="outlined"
                                value={editText}
                                onChange={(e) => setEditText(e.target.value)}
                                fullWidth
                                disabled={isUpdating}
                              />
                              <Button
                                variant="contained"
                                onClick={handleUpdateTodo}
                                disabled={isUpdating}
                                sx={{
                                  whiteSpace: "nowrap",
                                  padding: "10px 20px",
                                }}
                              >
                                {isUpdating ? (
                                  <CircularProgress size={24} color="inherit" />
                                ) : (
                                  "Update"
                                )}
                              </Button>
                            </Stack>
                          </>
                        ) : (
                          <Stack
                            direction={{ xs: "column", md: "row" }}
                            justifyContent="space-between"
                            alignItems="center"
                            gap={2}
                            sx={{ width: "100%" }}
                          >
                            <Stack width={"100%"}>
                              <ListItemText
                                primary={
                                  <Typography
                                    variant="h6"
                                    align="left"
                                    sx={{
                                      textDecoration: todo.completed
                                        ? "line-through"
                                        : "none",
                                      color: todo.completed ? "gray" : "white",
                                    }}
                                  >
                                    {todo.text}
                                  </Typography>
                                }
                                secondary={
                                  <Typography
                                    variant="body2"
                                    color="textSecondary"
                                  >
                                    Last Updated: {formatDate(todo.updatedAt)}
                                  </Typography>
                                }
                              />
                            </Stack>
                            <Stack
                              direction="row"
                              spacing={1}
                              width={"30%"}
                              justifyContent="flex-end"
                            >
                              <Stack>
                                <IconButton
                                  onClick={() => handleEditTodo(todo)}
                                  color="primary"
                                  disabled={isUpdating || isDeleting}
                                  aria-label="edit todo"
                                >
                                  <Edit />
                                </IconButton>
                              </Stack>
                              <Stack>
                                <IconButton
                                  onClick={() => handleDeleteTodo(todo.id)}
                                  color="error"
                                  disabled={isDeleting || isUpdating}
                                  aria-label="delete todo"
                                >
                                  {isDeleting ? (
                                    <CircularProgress
                                      size={24}
                                      color="inherit"
                                    />
                                  ) : (
                                    <Delete />
                                  )}
                                </IconButton>
                              </Stack>
                              <Stack>
                                <IconButton
                                  onClick={() => handleCompleteTodo(todo)}
                                  color={todo.completed ? "success" : "default"}
                                  disabled={isUpdating || isDeleting}
                                  aria-label="toggle complete todo"
                                >
                                  {todo.completed ? (
                                    <ReplayIcon />
                                  ) : (
                                    <DoneAllIcon />
                                  )}
                                </IconButton>
                              </Stack>
                            </Stack>
                          </Stack>
                        )}
                      </ListItem>
                    </Flipped>
                  ))}
                </List>
              </Flipper>
            )}
          </Stack>
        </>
      ) : (
        <Typography align="center" variant="h6" color="textSecondary">
          Please log in to manage your todos.
        </Typography>
      )}
    </Stack>
  );
};

export default TodoList;
