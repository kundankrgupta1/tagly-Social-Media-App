"use client"

const Toast = ({ toast }) => {
  return (
    <>
      {toast?.isOpen && (
        <div className="fixed top-6 right-6 z-50 animate-slide-in-right">
          <div
            className={`relative overflow-hidden rounded-2xl shadow-2xl backdrop-blur-xl border ${
              toast?.type === "success"
                ? "bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-green-500/30"
                : "bg-gradient-to-r from-red-500/20 to-pink-500/20 border-red-500/30"
            }`}
          >
            {/* Animated Background */}
            <div
              className={`absolute inset-0 ${
                toast?.type === "success"
                  ? "bg-gradient-to-r from-green-500/10 to-emerald-500/10"
                  : "bg-gradient-to-r from-red-500/10 to-pink-500/10"
              } animate-pulse`}
            ></div>

            <div className="relative z-10 flex items-center px-6 py-4 gap-3">
              <div
                className={`w-2 h-2 rounded-full ${
                  toast?.type === "success" ? "bg-green-400" : "bg-red-400"
                } animate-pulse`}
              ></div>
              <p className="text-white font-medium">{toast?.message}</p>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
				@keyframes slide-in-right {
					from {
						transform: translateX(100%);
						opacity: 0;
					}
					to {
						transform: translateX(0);
						opacity: 1;
					}
				}
				.animate-slide-in-right {
					animation: slide-in-right 0.3s ease-out;
				}
			`}</style>
    </>
  )
}

export default Toast
