import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Blog from "./Blog.jsx";

test("renders only the blog title and author by default", () => {
  const blog = {
    title: "Testing a new blog entry",
    author: "The Developer",
    url: "http://testing-react-apps.com",
  };

  render(<Blog blog={blog} />);

  const titleElement = screen.getByText(
    "Testing a new blog entry by The Developer",
  );
  const urlElement = screen.queryByText("http://testing-react-apps.com");
  const likesElement = screen.queryByText("0");

  expect(titleElement).toBeDefined();
  expect(urlElement).toBeNull();
  expect(likesElement).toBeNull();
});

test("clicking the show button displays the full blog details", async () => {
  const blog = {
    title: "Testing a new blog entry",
    author: "The developer",
    url: "http://testing-react-apps.com",
    likes: 0,
  };

  render(<Blog blog={blog} />);

  const user = userEvent.setup();
  const button = screen.getByText("show");
  await user.click(button);

  const urlElement = screen.getByText("http://testing-react-apps.com");
  const likesElement = screen.getAllByText("0");

  expect(urlElement).toBeDefined();
  expect(likesElement).toBeDefined();
});

test("clicking the like button calls event handler once", async () => {
  const blog = {
    title: "Testing a new blog entry",
    author: "The developer",
    url: "http://testing-react-apps.com",
    likes: 0,
  };

  const loggedUser = {
    name: "The Test User",
    username: "tester",
  };

  const mockHandler = vi.fn();

  render(<Blog blog={blog} handleLikes={mockHandler} user={loggedUser} />);

  const user = userEvent.setup();

  const showButton = screen.getByText("show");
  await user.click(showButton);

  const likeButton = screen.getByText("like");
  await user.click(likeButton);
  await user.click(likeButton);

  expect(mockHandler.mock.calls).toHaveLength(2);
});
