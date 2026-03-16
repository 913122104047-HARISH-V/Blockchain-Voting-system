function calculateMajorityMark(totalConstituencies) {
  const total = Number(totalConstituencies);
  if (!Number.isInteger(total) || total < 1) {
    throw new Error("totalConstituencies must be a positive integer");
  }
  return Math.floor(total / 2) + 1;
}

export { calculateMajorityMark };
