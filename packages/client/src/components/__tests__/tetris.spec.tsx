import Input from '../Input/Input'
import { render } from '@testing-library/react';
describe('Input', () => {
  it('Input can be render', () => {
    const placeholderText = 'Test Placeholder';
    const input = render(
        <Input placeholder={placeholderText} setter={() => {}} />
    );
    expect(input).toBeDefined();
  });
});