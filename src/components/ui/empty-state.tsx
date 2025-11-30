import { EmptyState, VStack } from "@chakra-ui/react";
import type { ReactNode } from "react";
import { FaSearch } from "react-icons/fa";

export type EmptyStateComponentProps = {
  icon?: ReactNode;
  title?: string | ReactNode;
  description?: string | ReactNode;
  action?: ReactNode;
};

export function EmptyStateComponent({
  icon,
  title,
  description,
  action,
}: EmptyStateComponentProps) {
  return (
    <EmptyState.Root>
      <EmptyState.Content>
        <EmptyState.Indicator>{icon ?? <FaSearch />}</EmptyState.Indicator>
        <VStack textAlign="center">
          <EmptyState.Title>{title ?? "Record is empty"}</EmptyState.Title>
          <EmptyState.Description>
            {description ?? "Add a new record to get started"}
          </EmptyState.Description>
        </VStack>
        {action}
      </EmptyState.Content>
    </EmptyState.Root>
  );
}
