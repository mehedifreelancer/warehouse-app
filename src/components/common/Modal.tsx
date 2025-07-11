import { Dialog } from "primereact/dialog";
import { useContext } from "react";
import { GlobalContext } from "../../layouts/RootLayout";

interface CustomModalHeaderProps {
  title: string;
}

const CustomModalHeader: React.FC<CustomModalHeaderProps> = ({
  title,
}: {
  title: string;
}) => {
  return (
    <div className="flex items-center justify-between pb-5 border-b border-[#EEEEEE] dark:border-gray-900 ">
      <h2 className="text-[#444050] dark:text-[#cAcAcA] font-sans font-semibold text-[17px] leading-[100%] tracking-[0.3px]">
        {title}
      </h2>
    </div>
  );
};

const Modal = ({
  modalTitle,
  children,
  modalCrossAction
}: {
  modalTitle: string;
  children: React.ReactNode;
  modalCrossAction?:any
}) => {
  const { modalVisibility, setModalVisibility } = useContext<any>(GlobalContext);

  return (
    <div className="card">
      <Dialog
        header={<CustomModalHeader title={modalTitle} />}
        visible={modalVisibility}
        style={{ width: "50vw" }}
        draggable={false}
        onHide={() => {
          // if (!modalVisibility) return;
          setModalVisibility(false);
          modalCrossAction();
        }}
      >
        {children}
      </Dialog>
    </div>
  );
};

export default Modal;
