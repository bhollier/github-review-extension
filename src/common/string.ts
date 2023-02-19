const commaSeparatedList = (list: string[], conjunction?: string) =>
  list
    .map((item, i) => {
      if (conjunction && i !== 0 && i === list.length - 1) {
        return conjunction + item;
      }
      if (i !== 0) {
        return `, ${item}`;
      }
      return item;
    })
    .join('');

export { commaSeparatedList };
