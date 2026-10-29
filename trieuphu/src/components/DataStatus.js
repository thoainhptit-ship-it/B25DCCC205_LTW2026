const DataStatus = ({ loading, error }) => {
  if (loading) return <p>Đang tải câu hỏi...</p>;
  if (error) return <p>Không tải được câu hỏi.</p>;
  return null;
};

export default DataStatus;