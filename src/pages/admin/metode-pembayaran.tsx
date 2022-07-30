import { Main } from "@components/layout/Main";
import { PaymentMethodTable } from "@module/admin/paymentMethod";

const MetodePembayaran = () => {
  return (
    <Main title="Metode Pembayaran">
      <PaymentMethodTable />
    </Main>
  );
};

export default MetodePembayaran;
