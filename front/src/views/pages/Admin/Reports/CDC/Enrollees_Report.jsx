import { useEffect, useState } from "react";
import axiosClient from "../../../../../api/axiosClient";
import { Modal } from "flowbite-react";

const Enrollees_Report = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedBarangay, setSelectedBarangay] = useState(null);
    const [openViewModal, setOpenViewModal] = useState(false);

    useEffect(() => {
        axiosClient.get("opol-cdc-enrollees-totalcounts")
            .then(response => {
                setData(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error("Error fetching data:", error);
                setLoading(false);
            });
    }, []);

    const openModal = (barangay) => {
        setSelectedBarangay(barangay);
        setOpenViewModal(true);
    };

    const closeModal = () => {
        setOpenViewModal(false);
        setSelectedBarangay(null);
    };

    if (loading) return <p className="text-center mt-5">Loading...</p>;

    return (
        <div className="p-5">
            {/* Total Summary */}
            <div className="bg-gray-100 p-5 rounded-xl text-center shadow-md">
                <h2 className="text-lg font-bold text-gray-700">TOTAL</h2>
                <p className="text-orange-600 font-semibold">Total List of Enrollees in OPOL</p>
                <span className="bg-gray-700 text-white text-xl px-4 py-2 rounded-full">
                    {data.reduce((total, barangay) => total + barangay.total_records, 0)}
                </span>
            </div>

            {/* Barangay Stats Grid */}
            <div className="grid grid-cols-3 gap-4 mt-5">
                {data.map((barangay, index) => (
                    <div key={index} className="bg-white p-4 rounded-xl shadow-md flex justify-between items-center">
                        <div>
                            <h3 className="font-bold text-gray-700">{barangay.barangay}</h3>
                            <p className="text-sm text-green-700">Total Enrollees</p>
                        </div>
                        <p className="text-blue-600 font-bold text-xl">{barangay.total_records}</p> 
                        <button 
                            className="bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600"
                            onClick={() => openModal(barangay)}
                        >
                            View
                        </button>
                    </div>
                ))}
            </div>

            {/* Modal */}
            <Modal show={openViewModal} size="xl" onClose={closeModal}>
                <Modal.Header>
                    {selectedBarangay ? `${selectedBarangay.barangay} - Age Group Details` : "Loading..."}
                </Modal.Header>
                <Modal.Body>
                    {selectedBarangay && (
                        <div>
                            <table className="w-full border-collapse border">
                                <thead>
                                    <tr className="bg-gray-200">
                                        <th className="p-2 border">Age Group</th>
                                        <th className="p-2 border">Male</th>
                                        <th className="p-2 border">Female</th>
                                        <th className="p-2 border">Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {[
                                        { ageGroup: "Months Old", male: selectedBarangay.months_old_count, female: 0 },
                                        { ageGroup: "1 Year Old", male: selectedBarangay.One_Yrs_Old, female: 0 },
                                        { ageGroup: "2 Years Old", male: selectedBarangay.Two_Yrs_Old, female: 0 },
                                        { ageGroup: "3 Years Old", male: selectedBarangay.Three_Yrs_Old, female: 0 },
                                        { ageGroup: "4 Years Old", male: selectedBarangay.Four_Yrs_Old, female: 0 },
                                        { ageGroup: "5 Years Old", male: selectedBarangay.Five_Yrs_Old, female: 0 }
                                    ].map((row, i) => (
                                        <tr key={i} className="text-center">
                                            <td className="p-2 border">{row.ageGroup}</td>
                                            <td className="p-2 border">{row.male}</td>
                                            <td className="p-2 border">{row.female}</td>
                                            <td className="p-2 border">{Number(row.male) + Number(row.female)}</td>
                                        </tr>
                                    ))}
                                    <tr className="text-center font-bold bg-gray-300">
                                        <td className="p-2 border">Total</td>
                                        <td className="p-2 border">{selectedBarangay.male_count}</td>
                                        <td className="p-2 border">{selectedBarangay.female_count}</td>
                                        <td className="p-2 border">{selectedBarangay.total_records}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <button
                        onClick={closeModal}
                        className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
                    >
                        Close
                    </button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default Enrollees_Report;
