export function hasError(container, message = 'Some Error') {
  expect(container.firstChild.lastChild.lastChild).toHaveClass('col');
  expect(container.firstChild.lastChild.lastChild.children).toHaveLength(1);
  expect(container.firstChild.lastChild.lastChild.firstChild).toHaveClass(
    'fade alert alert-danger alert-dismissible show'
  );
  expect(
    container.firstChild.lastChild.lastChild.firstChild.getAttribute('role')
  ).toEqual('alert');
  expect(container.firstChild.lastChild.lastChild.firstChild).toHaveTextContent(
    message
  );
  expect(
    container.firstChild.lastChild.lastChild.firstChild.children
  ).toHaveLength(1);
  expect(
    container.firstChild.lastChild.lastChild.firstChild.firstChild.getAttribute(
      'aria-label'
    )
  ).toEqual('Close alert');
  expect(
    container.firstChild.lastChild.lastChild.firstChild.firstChild.getAttribute(
      'type'
    )
  ).toEqual('button');
  expect(
    container.firstChild.lastChild.lastChild.firstChild.firstChild
  ).toHaveClass('btn-close');
}
