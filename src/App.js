import {useNavigate} from "react-router-dom";

function App() {
  const navigate = useNavigate();

  const handleConnectAsCamera = () => {
    navigate("/monitor");
  };

  const handleConnectAsClient = () => {
    navigate("/status");
  };

  return (
    <div className="bg-[#FCFFE0] min-h-screen">
      <div className="bg-[#BACD92] h-20 md:h-24 flex justify-center items-center w-full text-3xl md:text-5xl z-50 fixed font-semibold">
        Baby Care Monitor
      </div>

      <img
        src="/baby-landing.svg"
        className="absolute left-0 top-0 max-h-screen object-cover z-0"
        alt="Baby Care Monitor"
      />

      <div className="bg-white w-4/5 md:w-96 flex flex-col gap-8 text-black px-8 z-50 absolute py-6 rounded-lg md:left-96 bottom-48 left-6 md:top-72">
        <h1 className="font-semibold text-2xl md:text-4xl">
          Peace of Mind, All the Time...
        </h1>

        <div className="flex gap-2 items-center flex-col">
          <div
            className="bg-[#E4FFE0] hover:brightness-105 text-lg md:text-xl w-fit p-4 rounded-lg cursor-pointer"
            onClick={handleConnectAsCamera}
          >
            <p>Connect as Monitor</p>
          </div>

          <div
            className="bg-[#E4FFE0] hover:brightness-105 text-lg md:text-xl w-fit p-4 rounded-lg cursor-pointer"
            onClick={handleConnectAsClient}
          >
            <p>Connect as Client</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
