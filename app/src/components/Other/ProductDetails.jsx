import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import GET from '../../utils/GET';
import { Image } from '@mui/icons-material';


const ProductDetails = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);

    useEffect(() => {
        get_products();
        console.log(product);
    }, []);
    const get_products = async () => {
        const r = await GET('products');
        const findProduct = r.products.find((p) => p.id = id);
        setProduct(findProduct);
    }

    const format_date = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };


    return (
        <>
            <Link to="/products" className="text-gray-600 ml-14 mt-4 mb-4 flex hover:text-gray-800">
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
            <div className="md:flex items-start justify-center pb-12 2xl:px-20 md:px-6 px-4">
                <div>
                    <div className="xl:w-2/6 lg:w-2/5 w-80 md:block hidden">
                        <img className="w-full" alt="image of a girl posing" src={product?.image} /> 
                    </div>

                    <div className="mx-auto px-5">
                        <div className="max-w-xs cursor-pointer rounded-lg bg-white p-2 shadow duration-150 hover:scale-105 hover:shadow-md">
                            <img className="w-full rounded-lg object-cover object-center" src='' alt="product" />
                            <div>
                                <div className="my-6 flex items-center justify-between px-4">
                                    <p className="font-bold text-gray-500">{product?.supplier?.name.toUpperCase()}</p> 
                                </div>
                                <div className="my-4 flex items-center justify-between px-4">
                                    <p className="text-sm font-semibold text-gray-500">Remise F</p>
                                    <p className="rounded-full bg-blue-500 px-2 py-0.5 text-xs font-semibold text-white">{product?.supplier.remise_f}</p>
                                    </div>
                                <div className="my-4 flex items-center justify-between px-4">
                                    <p className="text-sm font-semibold text-gray-500">Remise F Composition</p>
                                    <p className="rounded-full bg-gray-200 px-2 py-0.5 text-xs font-semibold text-gray-600">{product?.supplier.remise_f_composition}</p>
                                </div>
                                <div className="my-4 flex items-center justify-between px-4">
                                    <p className="text-sm font-semibold text-gray-500">Date Debut</p>
                                    <p className="rounded-full bg-yellow-200 px-2 py-0.5 text-xs font-semibold text-gray-600">{format_date(product?.supplier.date_debut)}</p>
                                </div>
                                <div className="my-4 flex items-center justify-between px-4">
                                    <p className="text-sm font-semibold text-gray-500">Date Fin</p>
                                    <p className="rounded-full bg-green-200 px-2 py-0.5 text-xs font-semibold text-gray-600">{format_date(product?.supplier.date_fin)}</p>
                                </div>
                                <div className="my-4 flex items-center justify-between px-4">
                                    <p className="text-sm font-semibold text-gray-500">Ce fournisseur a été créé pour la première fois à</p>
                                    <p className="rounded-full bg-orange-200 px-2 py-0.5 text-xs font-semibold text-gray-600">{format_date(product?.supplier.created_at)}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>



                <div className="md:hidden">
                    <img className="w-full" alt="image of a girl posing" src="https://i.ibb.co/QMdWfzX/component-image-one.png" />
                    <div className="flex items-center justify-between mt-3 space-x-4 md:space-x-0">
                        <img alt="image-tag-one" className="md:w-48 md:h-48 w-full" src="https://i.ibb.co/cYDrVGh/Rectangle-245.png" />
                        <img alt="image-tag-one" className="md:w-48 md:h-48 w-full" src="https://i.ibb.co/f17NXrW/Rectangle-244.png" />
                        <img alt="image-tag-one" className="md:w-48 md:h-48 w-full" src="https://i.ibb.co/cYDrVGh/Rectangle-245.png" />
                        <img alt="image-tag-one" className="md:w-48 md:h-48 w-full" src="https://i.ibb.co/f17NXrW/Rectangle-244.png" />
                    </div>
                </div>


                <div className="xl:w-2/5 md:w-1/2 lg:ml-8 md:ml-6 md:mt-0 mt-6">

                    <div className="border-b border-gray-200 pb-6">
                        <p className="text-sm leading-none text-gray-600 dark:text-gray-300">{product?.sub_category?.category.name}</p>
                        <h1 className="lg:text-2xl text-xl font-semibold lg:leading-6 leading-7 text-gray-800 dark:text-white mt-2">{product?.designation}</h1>
                    </div>
                    <div className="py-4 border-b border-gray-200 flex items-center justify-between">
                        <p className="text-base leading-4 text-gray-800 dark:text-gray-300">Last Update</p>
                        <div className="flex items-center justify-center">
                            <p className="text-sm leading-none text-gray-600 dark:text-gray-300 mr-2">{format_date(product?.updated_at)}</p>
                            <svg className="cursor-pointer text-gray-300 dark:text-white" width="6" height="10" viewBox="0 0 6 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M1 1L5 5L1 9" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                    </div>


                    <div className="py-4 border-b border-gray-200 flex items-center justify-between">
                        <p className="text-base leading-4 text-gray-800 dark:text-gray-300">Marge Brut</p>
                        <div className="flex items-center justify-center">
                            <p className="text-sm leading-none text-gray-600 dark:text-gray-300 mr-3">{product?.marge_brut}</p>
                            <svg className="text-gray-300 dark:text-white cursor-pointer" width="6" height="10" viewBox="0 0 6 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M1 1L5 5L1 9" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                    </div>

                    <div className="py-4 border-b border-gray-200 flex items-center justify-between">
                        <p className="text-base leading-4 text-gray-800 dark:text-gray-300">Prix Achat</p>
                        <div className="flex items-center justify-center">
                            <p className="text-sm leading-none text-gray-600 dark:text-gray-300 mr-3">{product?.prix_achat}</p>
                            <svg className="text-gray-300 dark:text-white cursor-pointer" width="6" height="10" viewBox="0 0 6 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M1 1L5 5L1 9" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                    </div>

                    <div className="py-4 border-b border-gray-200 flex items-center justify-between">
                        <p className="text-base leading-4 text-gray-800 dark:text-gray-300">Prix Tarif</p>
                        <div className="flex items-center justify-center">
                            <p className="text-sm leading-none text-gray-600 dark:text-gray-300 mr-3">{product?.prix_tarif}</p>
                            <svg className="text-gray-300 dark:text-white cursor-pointer" width="6" height="10" viewBox="0 0 6 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M1 1L5 5L1 9" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                    </div>

                    <div className="py-4 border-b border-gray-200 flex items-center justify-between">
                        <p className="text-base leading-4 text-gray-800 dark:text-gray-300">Prix Vente</p>
                        <div className="flex items-center justify-center">
                            <p className="text-sm leading-none text-gray-600 dark:text-gray-300 mr-3">{product?.prix_vente}</p>
                            <svg className="text-gray-300 dark:text-white cursor-pointer" width="6" height="10" viewBox="0 0 6 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M1 1L5 5L1 9" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                    </div>

                    <div className="py-4 border-b border-gray-200 flex items-center justify-between">
                        <p className="text-base leading-4 text-gray-800 dark:text-gray-300">Reference</p>
                        <div className="flex items-center justify-center">
                            <p className="text-sm leading-none text-gray-600 dark:text-gray-300 mr-3">{product?.reference}</p>
                            <svg className="text-gray-300 dark:text-white cursor-pointer" width="6" height="10" viewBox="0 0 6 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M1 1L5 5L1 9" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                    </div>

                    <div className="py-4 border-b border-gray-200 flex items-center justify-between">
                        <p className="text-base leading-4 text-gray-800 dark:text-gray-300">TVA</p>
                        <div className="flex items-center justify-center">
                            <p className="text-sm leading-none text-gray-600 dark:text-gray-300 mr-3">{product?.TVA}</p>
                            <svg className="text-gray-300 dark:text-white cursor-pointer" width="6" height="10" viewBox="0 0 6 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M1 1L5 5L1 9" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                    </div>


                    <div className="py-4 border-b border-gray-200 flex items-center justify-between">
                        <p className="text-base leading-4 text-gray-800 dark:text-gray-300">Remise</p>
                        <div className="flex items-center justify-center">
                            <p className="text-sm leading-none text-gray-600 dark:text-gray-300 mr-3">{product?.remise}</p>
                            <svg className="text-gray-300 dark:text-white cursor-pointer" width="6" height="10" viewBox="0 0 6 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M1 1L5 5L1 9" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                    </div>

                    <div>
                        <div className="border-t border-b py-4 mt-7 border-gray-200">
                            <div className="flex justify-between items-center cursor-pointer">
                                <p className="text-base leading-4 text-gray-800 dark:text-gray-300">Shipping and returns</p>
                                <button className="cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 rounded" role="button" aria-label="show or hide">
                                    <svg className={`transform text-gray-300 dark:text-white rotate-180`} width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M9 1L5 5L1 1" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </button>
                            </div>

                        </div>
                    </div>

                </div>
            </div>
        </>
    );
};

export default ProductDetails;
