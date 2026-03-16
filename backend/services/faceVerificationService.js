function verifyFace({ inputFaceEmbedding, storedFaceEmbedding }) {
  if (!storedFaceEmbedding) return false;
  if (!inputFaceEmbedding) return false;
  return String(inputFaceEmbedding).trim() === String(storedFaceEmbedding).trim();
}

export { verifyFace };
