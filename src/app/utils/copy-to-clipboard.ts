export const copyToClipboard = (str: string): void => {
  const input = document.createElement('input');
  input.setAttribute('value', str);
  document.body.appendChild(input);
  input.select();
  document.execCommand('copy');
  document.body.removeChild(input);
};
