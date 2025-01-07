import React, { useEffect, useRef, useState } from "react";

const FullscreenOverlay = ({ propertiesToSend, onClose }) => {
    const overlayRef = useRef(null); // Ref för att hantera scrollning
    const [currentSection, setCurrentSection] = useState(0); // Håller koll på aktuell sektion
    const [property, setProperty] = useState(null); // Håller fastighetsdata
    const [loading, setLoading] = useState(true); // Hanterar laddningstillstånd
    const [error, setError] = useState(false); // Hanterar fel

    useEffect(() => {
        if (!propertiesToSend) {
            console.error("Ingen property skickades till overlayen!");
            setError(true);
            setLoading(false);
            return;
        }

        const fetchProperty = async () => {
            setLoading(true);
            setError(false); // Återställ felstatus
            try {
                const response = await fetch(`https://localhost:7150/api/kommuner/realEstateById/${propertiesToSend}`);
                if (!response.ok) throw new Error("Failed to fetch property data");
                const data = await response.json();
                setProperty(data);
            } catch (error) {
                console.error("Error fetching property data:", error);
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        fetchProperty();
    }, [propertiesToSend]);

    const handleScroll = (direction) => {
        const currentScroll = overlayRef.current.scrollTop;
        const sectionHeight = window.innerHeight;

        if (direction === "up" && currentSection > 0) {
            overlayRef.current.scrollTo({
                top: currentScroll - sectionHeight,
                behavior: "smooth",
            });
            setCurrentSection((prev) => prev - 1);
        } else if (direction === "down" && currentSection < sections.length - 1) {
            overlayRef.current.scrollTo({
                top: currentScroll + sectionHeight,
                behavior: "smooth",
            });
            setCurrentSection((prev) => prev + 1);
        }
    };

    const handleScrollToTop = () => {
        overlayRef.current.scrollTo({
            top: 0,
            behavior: "smooth",
        });
        setCurrentSection(0);
    };

    if (loading) {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex flex-col">
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 text-white text-3xl font-bold hover:text-gray-300 focus:outline-none z-50"
                >
                    &times;
                </button>
                <div className="flex-grow flex justify-center items-center">
                    <div className="animate-pulse space-y-4">
                        <div className="h-6 bg-gray-700 rounded w-48"></div>
                        <div className="h-4 bg-gray-700 rounded w-64"></div>
                        <div className="h-4 bg-gray-700 rounded w-32"></div>
                        <div className="h-6 bg-gray-700 rounded w-48"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex flex-col">
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 text-white text-3xl font-bold hover:text-gray-300 focus:outline-none z-50"
                >
                    &times;
                </button>
                <div className="flex-grow flex flex-col justify-center items-center text-white px-6">
                    <h3 className="text-xl font-semibold mb-4">Något gick fel</h3>
                    <p className="text-gray-300 mb-6 text-center">
                        Vi kunde inte hämta fastighetsdata. Kontrollera din internetanslutning
                        eller försök igen senare.
                    </p>
                    <button
                        onClick={handleScrollToTop}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500"
                    >
                        Försök igen
                    </button>
                </div>
            </div>
        );
    }

    const sections = [
        {
            title: "Grundläggande Information",
            fields: [
                { label: "Adress", value: property.street || "Ej tillgänglig" },
                { label: "Såld Datum", value: new Date(property.soldAt).toLocaleDateString("sv-SE") },
                { label: "Pris", value: property.price ? `${property.price} kr` : "Ej tillgänglig" },
            ],
        },
        {
            title: "Ytterligare Information",
            fields: [
                { label: "Storlek", value: property.livingArea ? `${property.livingArea} m²` : "Ej tillgänglig" },
                { label: "Tomtarea", value: property.landArea ? `${property.landArea} m²` : "Ej tillgänglig" },
                { label: "Byggår", value: property.buildYear || "Ej tillgänglig" },
                { label: "Fastighetstyp", value: property.propertyType || "Ej tillgänglig" },
                { label: "Rum", value: property.rooms ? `${property.rooms} rum` : "Ej tillgänglig" },
            ],
        },
    ];

    return (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex flex-col">
            <button
                onClick={onClose}
                className="absolute top-6 right-6 text-white text-3xl font-bold hover:text-gray-300 focus:outline-none z-50"
            >
                &times;
            </button>

            <div
                ref={overlayRef}
                className="flex-grow overflow-hidden snap-y snap-mandatory"
                style={{
                    scrollbarWidth: "none",
                    msOverflowStyle: "none",
                }}
            >
                <style>
                    {`
                    ::-webkit-scrollbar {
                        display: none;
                    }
                `}
                </style>
                {sections.map((section, index) => (
                    <div
                        key={index}
                        className="min-h-screen w-full flex flex-col justify-center items-center px-6 snap-center"
                    >
                        <div className="bg-gray-950 bg-opacity-80 rounded-lg p-6 w-full max-w-3xl">
                            <h3 className="text-xl font-semibold text-white mb-4">
                                {section.title}
                            </h3>
                            <div className="space-y-2 text-gray-300">
                                {section.fields.map((field, i) => (
                                    <p key={i}>
                                        <strong>{field.label}:</strong> {field.value}
                                    </p>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="absolute bottom-12 w-full flex flex-col md:flex-row justify-center items-center space-y-2 md:space-y-0 md:space-x-4 z-50 px-4">
                {currentSection > 0 && (
                    <button
                        onClick={() => handleScroll("up")}
                        className="bg-gray-800 bg-opacity-80 text-white px-4 py-2 rounded hover:bg-gray-700 w-full md:w-auto"
                    >
                        Scrolla upp
                    </button>
                )}
                {currentSection < sections.length - 1 && (
                    <button
                        onClick={() => handleScroll("down")}
                        className="bg-gray-800 bg-opacity-80 text-white px-4 py-2 rounded hover:bg-gray-700 w-full md:w-auto"
                    >
                        Nästa
                    </button>
                )}
                {currentSection === sections.length - 1 && (
                    <button
                        onClick={handleScrollToTop}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500 w-full md:w-auto"
                    >
                        Scrolla till toppen
                    </button>
                )}
            </div>
        </div>
    );
};

export default FullscreenOverlay;
