import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import GET from '../../utils/GET';
import DefaultAvatar from '../../assets/default_avatar.png';
import { Spinner } from 'flowbite-react';

const ClientDetails = () => {
    const { id } = useParams();
    const [client, setClient] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        get_client();
    }, [id]);

    const get_client = async () => {
        setLoading(true);
        const r = await GET(`clients/${id}`, false);
        console.log(r);
        setClient(r.client);
        setLoading(false);
    };

    const format_date = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    if (loading) {
        return <Spinner />
    }

    return (
        <>
            <Link to="/clients" className="text-gray-600 ml-14 mt-4 mb-4 flex hover:text-gray-800">
                <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15 19l-7-7 7-7"
                    ></path>
                </svg>
            </Link>
            <div className="flex justify-center items-center pb-12 2xl:px-20 md:px-6 px-4">
                <div className="w-full flex justify-center items-center">
                    <div className="w-full max-w-4xl">
                        <div className="cursor-pointer rounded-lg bg-white p-6 shadow duration-150 hover:scale-105 hover:shadow-md">
                            <div>
                                <div className="my-6 flex items-center justify-between px-4">
                                    <img className="w-32 object-cover p-4 object-center rounded-full" src={DefaultAvatar} alt="client" />
                                    <p className="font-bold text-xl text-gray-500">{client?.first_name.toUpperCase()} {client?.last_name.toUpperCase()}</p>
                                </div>
                                <div className="my-4 flex items-center justify-between px-4">
                                    <p className="text-sm font-semibold text-gray-500">Role</p>
                                    <p className="rounded-full bg-blue-500 px-2 py-0.5 text-xs font-semibold text-white">{client?.role}</p>
                                </div>
                                <div className="my-4 flex items-center justify-between px-4">
                                    <p className="text-sm font-semibold text-gray-500">Email</p>
                                    <p className="rounded-full bg-gray-200 px-2 py-0.5 text-xs font-semibold text-gray-600">{client?.email}</p>
                                </div>
                                <div className="my-4 flex items-center justify-between px-4">
                                    <p className="text-sm font-semibold text-gray-500">Phone</p>
                                    <p className="rounded-full bg-yellow-200 px-2 py-0.5 text-xs font-semibold text-gray-600">{client?.phone}</p>
                                </div>
                                <div className="my-4 flex items-center justify-between px-4">
                                    <p className="text-sm font-semibold text-gray-500">Address Exploitation</p>
                                    <p className="rounded-full bg-green-200 px-2 py-0.5 text-xs font-semibold text-gray-600">{client?.address_exploitation}</p>
                                </div>
                                <div className="my-4 flex items-center justify-between px-4">
                                    <p className="text-sm font-semibold text-gray-500">Suite Address Exploitation</p>
                                    <p className="rounded-full bg-orange-200 px-2 py-0.5 text-xs font-semibold text-gray-600">{client?.suite_address_exploitation}</p>
                                </div>
                                <div className="my-4 flex items-center justify-between px-4">
                                    <p className="text-sm font-semibold text-gray-500">Address Facturation</p>
                                    <p className="rounded-full bg-orange-200 px-2 py-0.5 text-xs font-semibold text-gray-600">{client?.address_facturation}</p>
                                </div>
                                <div className="my-4 flex items-center justify-between px-4">
                                    <p className="text-sm font-semibold text-gray-500">Suite Address Facturation</p>
                                    <p className="rounded-full bg-orange-200 px-2 py-0.5 text-xs font-semibold text-gray-600">{client?.suite_address_facturation}</p>
                                </div>
                                <div className="my-4 flex items-center justify-between px-4">
                                    <p className="text-sm font-semibold text-gray-500">CIN/ICE</p>
                                    <p className="rounded-full bg-blue-200 px-2 py-0.5 text-xs font-semibold text-gray-600">{client?.CIN_ICE}</p>
                                </div>
                                <div className="my-4 flex items-center justify-between px-4">
                                    <p className="text-sm font-semibold text-gray-500">CIN File</p>
                                    <p className="rounded-full bg-blue-200 px-2 py-0.5 text-xs font-semibold text-gray-600">{client?.CIN_file}</p>
                                </div>
                                <div className="my-4 flex items-center justify-between px-4">
                                    <p className="text-sm font-semibold text-gray-500">Raison Sociale</p>
                                    <p className="rounded-full bg-red-200 px-2 py-0.5 text-xs font-semibold text-gray-600">{client?.raison_sociale}</p>
                                </div>
                                <div className="my-4 flex items-center justify-between px-4">
                                    <p className="text-sm font-semibold text-gray-500">Type</p>
                                    <p className="rounded-full bg-blue-200 px-2 py-0.5 text-xs font-semibold text-gray-600">{client?.type}</p>
                                </div>
                                <div className="my-4 flex items-center justify-between px-4">
                                    <p className="text-sm font-semibold text-gray-500">Created At</p>
                                    <p className="rounded-full bg-orange-200 px-2 py-0.5 text-xs font-semibold text-gray-600">{format_date(client?.created_at)}</p>
                                </div>
                                <div className="my-4 flex items-center justify-between px-4">
                                    <p className="text-sm font-semibold text-gray-500">Updated At</p>
                                    <p className="rounded-full bg-orange-200 px-2 py-0.5 text-xs font-semibold text-gray-600">{format_date(client?.updated_at)}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ClientDetails;
