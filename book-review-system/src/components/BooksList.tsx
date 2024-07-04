import React from "react";
import { List, ListItem, ListItemText, Typography, Box, Button } from "@mui/material";
import { useQuery, useQueryClient } from "react-query";
import { deleteBook, getAllBooks } from "../services/bookService";

interface Book {
  id: number;
  title: string;
  author: string;
  reviews: Array<{
    id: number;
    text: string;
    rating: number;
  }>;
}

const fetchBooks = async (): Promise<Book[]> => {
  const response = await getAllBooks();
  console.log(`book = ${JSON.stringify(response)}`);
  return response.books;
};

const BooksList: React.FC = () => {
  const queryClient = useQueryClient();

  const { data, error, isLoading } = useQuery<Book[]>("books", fetchBooks);

  const handleDelete = async (id: number) => {
    try {
      await deleteBook(id);
      queryClient.invalidateQueries("books"); // Invalidate the books query after deletion
    } catch (err) {
      console.error("Failed to delete book", err);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading books...</div>;

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: 4,
        backgroundColor: "#f0f4f8",
      }}
    >
      <Typography variant="h4" gutterBottom>
        Book List
      </Typography>
      <List sx={{ width: "100%", maxWidth: 600 }}>
        {data?.map((book) => (
          <ListItem
            key={book.id}
            alignItems="flex-start"
            sx={{
              backgroundColor: "#ffffff",
              marginBottom: 2,
              borderRadius: 2,
              boxShadow: 1,
            }}
          >
            <ListItemText
              primary={
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography variant="h6">
                    {book.title}
                  </Typography>
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => handleDelete(book.id)}
                  >
                    Delete
                  </Button>
                </Box>
              }
              secondary={
                <>
                  <Typography
                    component="span"
                    variant="body2"
                    color="textPrimary"
                  >
                    {`Author: ${book.author}`}
                  </Typography>
                  <Typography component="div" variant="body2">
                    Reviews:
                  </Typography>
                  <ul>
                    {book.reviews.map((review) => (
                      <li key={review.id}>
                        {review.text} - Rating:{" "}
                        {review.rating}
                      </li>
                    ))}
                  </ul>
                </>
              }
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default BooksList;
