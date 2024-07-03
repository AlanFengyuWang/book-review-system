import { useQuery } from "react-query";
import axios from "axios";
import { List, ListItem, ListItemText, Typography } from "@mui/material";

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
	const { data } = await axios.get("/api/books");
	return data;
};

const BooksList: React.FC = () => {
	const { data, error, isLoading } = useQuery<Book[]>("books", fetchBooks);
	if (isLoading) return <div>Loading...</div>;
	if (error) return <div>Error loading books...</div>;
	return (
        <List>
          {data?.map((book) => (
            <ListItem key={book.id} alignItems="flex-start">
              <ListItemText
                primary={book.title}
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
                          {review.text} - Rating: {review.rating}
                        </li>
                      ))}
                    </ul>
                  </>
                }
              />
            </ListItem>
          ))}
        </List>
      );
};

export default BooksList;
