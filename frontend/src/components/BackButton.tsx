export const BackButton = () => {
    return (
        <>
            <button type="submit" onClick={() => window.history.back()} className="back-button">Back</button>
        </>
    );
}