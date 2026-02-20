import { useResume } from "../../context/ResumeContext";

const SummaryForm = () => {
    const { state, dispatch } = useResume();
    const { summary } = state;

    const handleChange = (e) => {
        dispatch({
            type: "UPDATE_SUMMARY",
            payload: e.target.value,
        });
    };

    return (
        <div>
            <div className="form-group">
                <textarea
                    id="summary"
                    name="summary"
                    value={summary}
                    onChange={handleChange}
                    placeholder="Write a brief professional summary..."
                    rows="5"
                />
            </div>
        </div>
    );
};

export default SummaryForm;
