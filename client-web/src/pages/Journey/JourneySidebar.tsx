import {
  IconSearch,
  IconChevronRight,
  IconChevronDown,
} from "@tabler/icons-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { FlattenedStep } from "@/types/journey";
import { flattenSteps, groupData } from "@/data";
import React from "react";

interface Props {
  currentStep: FlattenedStep;
  expandedGroups: Record<string, boolean>;
  setExpandedGroups: React.Dispatch<
    React.SetStateAction<Record<string, boolean>>
  >;
  stepContainerRefs: React.MutableRefObject<
    Record<string, HTMLDivElement | null>
  >;
  onClickStep: (groupId: string, stepIdInGroup: number) => void;
}

export function JourneySidebar({
  currentStep,
  expandedGroups,
  setExpandedGroups,
  stepContainerRefs,
  onClickStep,
}: Props) {
  // 그룹 라벨 클릭 => 펼치기/접기
  const toggleGroup = (groupId: string) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [groupId]: !prev[groupId],
    }));
  };

  return (
    <aside className="flex flex-col border-r border-gray-200 bg-white w-[280px]">
      {/* 상단: 제목 + 검색창 */}
      <div className="shrink-0 p-4 pb-2">
        <h1 className="text-base font-bold mb-3">Google Search Journey</h1>
        {/* 검색창 */}
        <div className="relative">
          <IconSearch
            size={16}
            className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <Input
            type="text"
            placeholder="Search"
            className="pl-7 pr-2 py-1 text-sm w-full border-gray-200 bg-gray-50"
          />
        </div>
      </div>

      {/* 단계 목록 스크롤 영역 */}
      <ScrollArea className="flex-1 py-2 pl-4 pr-1">
        {groupData.map((grp) => {
          const isExpanded = expandedGroups[grp.groupId] || false;
          const isCurrentGroup = grp.groupId === currentStep.groupId;

          // 그룹 라벨
          let groupLabelClass = `
            flex items-center h-8 px-2 gap-2 cursor-pointer
            rounded hover:bg-gray-100 text-step
          `;
          if (isCurrentGroup) {
            groupLabelClass += " font-semibold";
            if (!isExpanded) {
              groupLabelClass += " !text-blue-600";
            }
          }

          return (
            <div key={grp.groupId} className="mb-2">
              {/* 그룹 라벨 */}
              <div
                className={groupLabelClass}
                onClick={() => toggleGroup(grp.groupId)}
              >
                <span className="text-sm flex-1 whitespace-nowrap">
                  {grp.groupLabel}
                </span>
                {isExpanded ? (
                  <IconChevronDown className="h-4 w-4" />
                ) : (
                  <IconChevronRight className="h-4 w-4" />
                )}
              </div>

              {/* 펼쳐진 목록 */}
              {isExpanded && (
                <div
                  ref={(el) => (stepContainerRefs.current[grp.groupId] = el)}
                  className="ml-5 mt-1 max-h-[300px] overflow-auto flex flex-col gap-1"
                >
                  {grp.steps.map((st) => {
                    // flattenSteps 에서 해당 FlattenedStep 을 찾아온다
                    const foundFs = flattenSteps.find(
                      (fs) =>
                        fs.groupId === grp.groupId &&
                        fs.stepIdInGroup === st.id,
                    );
                    if (!foundFs) return null; // 혹은 return (some fallback)

                    const isActive =
                      foundFs.globalIndex === currentStep.globalIndex;
                    const stepClass = [
                      "px-2 py-1 rounded text-sm cursor-pointer hover:bg-gray-100",
                      isActive
                        ? "bg-gray-100 font-medium text-blue-600"
                        : "text-step",
                    ].join(" ");

                    return (
                      <div
                        key={st.id}
                        id={`step-${foundFs.globalIndex}`}
                        className={stepClass}
                        onClick={() => onClickStep(grp.groupId, st.id)}
                      >
                        {st.label}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </ScrollArea>
    </aside>
  );
}
