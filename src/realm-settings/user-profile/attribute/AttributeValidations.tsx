import React, { useEffect, useState } from "react";
import {
  Button,
  ButtonVariant,
  Divider,
  Flex,
  FlexItem,
  Text,
  TextVariants,
} from "@patternfly/react-core";
import { useTranslation } from "react-i18next";
import "../../realm-settings-section.css";
import { PlusCircleIcon } from "@patternfly/react-icons";
import { AddValidatorDialog } from "../attribute/AddValidatorDialog";
import {
  TableComposable,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@patternfly/react-table";
import { useConfirmDialog } from "../../../components/confirm-dialog/ConfirmDialog";
import useToggle from "../../../utils/useToggle";
import { useFormContext, useWatch } from "react-hook-form";

import type { KeyValueType } from "../../../components/attribute-form/attribute-convert";

import "../../realm-settings-section.css";

export const AttributeValidations = () => {
  const { t } = useTranslation("realm-settings");
  const [addValidatorModalOpen, toggleModal] = useToggle();
  const [validatorToDelete, setValidatorToDelete] =
    useState<{ name: string }>();
  const { setValue, control, register } = useFormContext();

  const validators = useWatch<KeyValueType[]>({
    name: "validations",
    control,
    defaultValue: [],
  });

  useEffect(() => {
    register("validations");
  }, []);

  const [toggleDeleteDialog, DeleteConfirm] = useConfirmDialog({
    titleKey: t("deleteValidatorConfirmTitle"),
    messageKey: t("deleteValidatorConfirmMsg", {
      validatorName: validatorToDelete?.name!,
    }),
    continueButtonLabel: "common:delete",
    continueButtonVariant: ButtonVariant.danger,
    onConfirm: async () => {
      const updatedValidators = validators.filter(
        (validator) => validator.key !== validatorToDelete?.name
      );

      setValue("validations", [...updatedValidators]);
    },
  });

  return (
    <>
      {addValidatorModalOpen && (
        <AddValidatorDialog
          onConfirm={(newValidator) => {
            setValue("validations", [
              ...validators,
              { key: newValidator.name, value: newValidator.config },
            ]);
          }}
          toggleDialog={toggleModal}
        />
      )}
      <DeleteConfirm />
      <div className="kc-attributes-validations">
        <Flex>
          <FlexItem align={{ default: "alignRight" }}>
            <Button
              id="addValidator"
              onClick={() => toggleModal()}
              variant="link"
              className="kc-addValidator"
              data-testid="addValidator"
              icon={<PlusCircleIcon />}
            >
              {t("realm-settings:addValidator")}
            </Button>
          </FlexItem>
        </Flex>
        <Divider />
        <TableComposable aria-label="validators-table">
          <Thead>
            <Tr>
              <Th>{t("validatorColNames.colName")}</Th>
              <Th>{t("validatorColNames.colConfig")}</Th>
              <Th />
            </Tr>
          </Thead>
          <Tbody>
            {validators.map((validator) => (
              <Tr key={validator.key}>
                <Td dataLabel={t("validatorColNames.colName")}>
                  {validator.key}
                </Td>
                <Td dataLabel={t("validatorColNames.colConfig")}>
                  {JSON.stringify(validator.value)}
                </Td>
                <Td>
                  <Button
                    key="validator"
                    variant="link"
                    data-testid="deleteValidator"
                    onClick={() => {
                      toggleDeleteDialog();
                      setValidatorToDelete({
                        name: validator.key,
                      });
                    }}
                  >
                    {t("common:delete")}
                  </Button>
                </Td>
              </Tr>
            ))}
            {validators.length === 0 && (
              <Text className="kc-emptyValidators" component={TextVariants.h6}>
                {t("realm-settings:emptyValidators")}
              </Text>
            )}
          </Tbody>
        </TableComposable>
      </div>
    </>
  );
};
