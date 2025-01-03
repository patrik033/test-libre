const KommunRankingTable = ({ data, loading }) => {
  console.log(data)
  if (loading) {
    return <p className="text-center text-gray-500">Laddar...</p>;
  }

  if (data.length === 0) {
    return <p className="text-center text-gray-500">Inga data att visa</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200 shadow-md rounded-lg">
        <thead className="bg-blue-600 text-white">
          <tr>
            <th className="px-6 py-3 text-left text-sm font-semibold">Rank</th>
            <th className="px-6 py-3 text-left text-sm font-semibold">Kommun</th>
            <th className="px-6 py-3 text-left text-sm font-semibold">Total Poäng</th>
            <th className="px-6 py-3 text-left text-sm font-semibold">Förändring från Föregående År</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr
              key={index}
              className={
                index % 2 === 0 ? "bg-gray-50 hover:bg-gray-200" : "bg-white hover:bg-gray-200"
              }
            >
              <td className="px-6 py-3 border-b text-sm text-gray-700 font-medium">
                {index + 1}
              </td>
              <td className="px-6 py-3 border-b text-sm text-gray-700">
                {item.kommunNamn}
              </td>
              <td className="px-6 py-3 border-b text-sm text-gray-700">
                {item.totalScore.toFixed(2)}
              </td>
              <td className="px-6 py-3 border-b text-sm text-gray-700">
                {item.scoreChange !== null
                  ? `${item.scoreChange > 0 ? "+" : ""}${item.scoreChange.toFixed(2)}`
                  : "Ingen förändring"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default KommunRankingTable;
