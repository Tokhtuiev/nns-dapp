import 'package:dfinity_wallet/data/icp_source.dart';
import 'package:dfinity_wallet/ui/transaction/wallet/transaction_details_widget.dart';
import 'package:dfinity_wallet/ui/transaction/wallet/transaction_done_widget.dart';
import 'package:dfinity_wallet/ui/transaction/wallet/transaction_done_widget.dart';
import 'package:dfinity_wallet/dfinity.dart';
import 'package:dfinity_wallet/data/canister.dart';
import 'package:dfinity_wallet/ui/_components/form_utils.dart';
import 'package:dfinity_wallet/ui/_components/valid_fields_submit_button.dart';

import '../wizard_overlay.dart';
import 'confirm_transactions_widget.dart';

class EnterAmountPage extends StatefulWidget {
  final ICPSource source;
  final String destinationAccountIdentifier;
  final int? subAccountId;

  const EnterAmountPage(
      {Key? key,
      required this.source,
      required this.destinationAccountIdentifier,
      this.subAccountId})
      : super(key: key);

  @override
  _EnterAmountPageState createState() => _EnterAmountPageState();
}

class _EnterAmountPageState extends State<EnterAmountPage> {
  late ValidatedTextField amountField;

  @override
  void initState() {
    super.initState();

    amountField = ValidatedTextField("Amount",
        validations: [
          StringFieldValidation.insufficientFunds(widget.source.icpBalance),StringFieldValidation.nonZero()
        ],
        inputType: TextInputType.number);
  }

  @override
  Widget build(BuildContext context) {
    var isNeuron = widget.source.type == ICPSourceType.NEURON;
    return SizedBox.expand(
      child: Padding(
        padding: const EdgeInsets.all(32.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.center,
          children: [
            Center(
              child: FractionallySizedBox(
                widthFactor: 0.7,
                child: Card(
                  child: Padding(
                    padding: const EdgeInsets.all(6.0),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.center,
                      children: [
                        Text("Amount", style: context.textTheme.headline3),
                        DebouncedValidatedFormField(amountField),
                      ],
                    ),
                  ),
                ),
              ),
            ),
            TallFormDivider(),
            IntrinsicWidth(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text("Source", style: context.textTheme.headline4),
                  VerySmallFormDivider(),
                  Text(widget.source.address,
                      style: context.textTheme.bodyText1),
                  TallFormDivider(),
                  Text("Destination", style: context.textTheme.headline4),
                  VerySmallFormDivider(),
                  Text(widget.destinationAccountIdentifier,
                      style: context.textTheme.bodyText1),
                  TallFormDivider(),
                  isNeuron
                ? Row()
                : Row(
                    children: [
                      Text("Transaction Fee",
                          style: context.textTheme.headline4),
                      TallFormDivider(),
                      Text(TRANSACTION_FEE_ICP.toString() + " ICP",
                          style: context.textTheme.bodyText1),
                    ],
                  )
                ],
              ),
            ),
            Expanded(child: Container()),
            SizedBox(
                height: 70,
                width: double.infinity,
                child: ValidFieldsSubmitButton(
                  child: Text("Review Transaction"),
                  onPressed: () async {
                    var amount = amountField.currentValue.toDouble()+TRANSACTION_FEE_ICP;
                    WizardOverlay.of(context).pushPage(
                        "Review Transaction",
                        ConfirmTransactionWidget(
                          amount: amount,
                          source: widget.source,
                          destination: widget.destinationAccountIdentifier,
                          subAccountId: widget.subAccountId,
                        ));
                  },
                  fields: [amountField],
                ))
          ],
        ),
      ),
    );
  }
}
