import { ReactNode } from "react";
import toast, { useToaster } from "react-hot-toast/headless";
import colors from "../../styles/colors";
import Cross from "../icons/Cross";
import Globe from "../icons/Globe";

function Notifications() {
  const { toasts, handlers } = useToaster();
  const { startPause, endPause } = handlers;

  return (
    <div onMouseEnter={startPause} onMouseLeave={endPause}>
      {toasts
        .filter((t) => t.visible)
        .map((t) => (
          // eslint-disable-next-line react/jsx-props-no-spreading
          <div {...t.ariaProps}>
            <div
              key={t.id}
              aria-live="assertive"
              className="fixed inset-x-0 bottom-0 flex items-center px-4 py-6 sm:p-6"
            >
              <div className="w-full flex flex-col items-center space-y-4">
                <div
                  className={`p-3 shadow-lg rounded flex ${
                    t.type === "error"
                      ? "bg-danger-text"
                      : "bg-secondary-background"
                  }`}
                >
                  <div className="flex items-start">
                    <div className="w-6 mt-1 mr-2">
                      <Globe color={colors["quaternary-text"]} />
                    </div>
                    {t.message as ReactNode}
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      toast.dismiss(t.id);
                    }}
                    className="inline-flex"
                  >
                    <Cross color={colors["quaternary-text"]} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
    </div>
  );
}

export default Notifications;
