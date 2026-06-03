import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';

describe('Basic test', () => {
  it('should pass a simple test', () => {
    expect(1 + 1).toBe(2);
  });

  it('should render a component', () => {
    render(<div>Hello, GovDB Shield</div>);
    expect(screen.getByText('GovDB Shield')).toBeInTheDocument();
  });
});
