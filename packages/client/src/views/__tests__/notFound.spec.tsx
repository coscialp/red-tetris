import { render } from "@testing-library/react";
import NotFound from "../notFound/404.tsx";

describe("notFound views", () => {
  it("should render the notFound view", () => {
    const notFound = render(<NotFound />);
    expect(notFound).toMatchSnapshot();
  });
});