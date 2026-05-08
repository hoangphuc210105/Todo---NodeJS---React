const Footer = ({ completedTaskCount = 0, activeTaskCount = 0 }) => {
  return (
    <>
      {completedTaskCount + activeTaskCount > 0 && (
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            {completedTaskCount > 0 && (
              <>
                Tuyệt vời, bạn đã hoàn thành {completedTaskCount} công việc{" "}
                {activeTaskCount > 0 &&
                  `
                    và còn ${activeTaskCount} công việc đang hoạt động`}
                ! Hãy tiếp tục duy trì thói quen tốt này nhé!
              </>
            )}

            {completedTaskCount === 0 && activeTaskCount > 0 && (
              <>
                Bạn đang có {activeTaskCount} công việc đang hoạt động. Hãy cố
                gắng hoàn thành chúng để đạt được mục tiêu của bạn nhé!
              </>
            )}
          </p>
        </div>
      )}
    </>
  );
};

export default Footer;
